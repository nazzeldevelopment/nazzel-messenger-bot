import 'dotenv/config';
import fs from 'fs';
import fca from 'ws3-fca';
import { BotLogger, logger } from './lib/logger.js';

const login = (fca as any).login || fca;
import { commandHandler } from './lib/commandHandler.js';
import { database } from './database/index.js';
import { redis } from './lib/redis.js';
import { createServer, startServer } from './services/server.js';
import config from '../config.json' with { type: 'json' };
import type { CommandContext, MessageOptions } from './types/index.js';

const APPSTATE_FILE = './appstate.json';
const prefix = config.bot.prefix;

async function main(): Promise<void> {
  BotLogger.startup(`Starting ${config.bot.name} v${config.bot.version}`);
  
  await redis.connect();
  
  await commandHandler.loadCommands();
  
  const app = createServer();
  startServer(app);
  
  let appState: any = null;
  
  if (fs.existsSync(APPSTATE_FILE)) {
    try {
      appState = JSON.parse(fs.readFileSync(APPSTATE_FILE, 'utf8'));
      BotLogger.info('Loaded appstate from file');
    } catch (error) {
      BotLogger.error('Failed to parse appstate.json', error);
    }
  }
  
  const credentials = { appState };
  
  const loginOptions = {
    selfListen: config.bot.selfListen,
    listenEvents: config.bot.listenEvents,
    updatePresence: true,
    autoMarkRead: config.bot.autoMarkRead,
    autoMarkDelivery: config.bot.autoMarkDelivery,
    userAgent: 'Mozilla/5.0 (Linux; Android 12; M2102J20SG) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Mobile Safari/537.36',
    forceLogin: true,
  };
  
  if (!appState) {
    BotLogger.warn('No appstate.json found.');
    BotLogger.info('ws3-fca requires cookie-based authentication (appstate.json).');
    BotLogger.info('Please provide a valid appstate.json file with Facebook cookies.');
    BotLogger.info('The Express server is running. Bot will not connect to Messenger.');
    return;
  }
  
  login(credentials, loginOptions, async (err: any, api: any) => {
    if (err) {
      BotLogger.error('Login failed', err);
      
      if (err.error === 'login-approval') {
        BotLogger.warn('Two-factor authentication required.');
        BotLogger.info('Please approve the login from your phone or enter the code.');
      }
      
      return;
    }
    
    BotLogger.success('Successfully logged in to Facebook Messenger');
    
    try {
      fs.writeFileSync(APPSTATE_FILE, JSON.stringify(api.getAppState(), null, 2));
      BotLogger.info('Saved appstate.json');
    } catch (error) {
      BotLogger.error('Failed to save appstate.json', error);
    }
    
    api.setOptions({
      selfListen: config.bot.selfListen,
      listenEvents: config.bot.listenEvents,
      autoMarkRead: config.bot.autoMarkRead,
      autoMarkDelivery: config.bot.autoMarkDelivery,
    });
    
    api.listenMqtt(async (err: any, event: any) => {
      if (err) {
        BotLogger.error('Listen error', err);
        await database.logEntry({
          type: 'error',
          level: 'error',
          message: `Listen error: ${err.message || err}`,
          metadata: { error: String(err) },
        });
        return;
      }
      
      BotLogger.debug(`Received event: ${event?.type}`, { event: JSON.stringify(event).substring(0, 500) });
      
      try {
        await handleEvent(api, event);
      } catch (error) {
        BotLogger.error('Event handling error', error);
        await database.logEntry({
          type: 'error',
          level: 'error',
          message: `Event handling error: ${error instanceof Error ? error.message : 'Unknown'}`,
          metadata: { error: String(error) },
        });
      }
    });
    
    BotLogger.success('Bot is now listening for messages');
  });
}

async function handleEvent(api: any, event: any): Promise<void> {
  switch (event.type) {
    case 'message':
    case 'message_reply':
      await handleMessage(api, event);
      break;
      
    case 'event':
      await handleGroupEvent(api, event);
      break;
      
    case 'message_reaction':
      BotLogger.event('reaction', { 
        threadId: event.threadID, 
        userId: event.userID,
        reaction: event.reaction,
      });
      break;
      
    case 'typ':
      break;
      
    default:
      BotLogger.debug(`Unhandled event type: ${event.type}`);
  }
}

async function handleMessage(api: any, event: any): Promise<void> {
  const body = event.body || '';
  const threadId = event.threadID;
  const senderId = event.senderID;
  
  BotLogger.message(threadId, senderId, body);
  
  await database.logEntry({
    type: 'message',
    level: 'info',
    message: body.substring(0, 200),
    threadId,
    userId: senderId,
  });
  
  if (config.features.xp.enabled) {
    await handleXP(api, senderId, threadId);
  }
  
  if (body.startsWith(prefix)) {
    const raw = body.slice(prefix.length).trim();
    const parts = raw.split(/\s+/);
    const commandName = parts.shift()?.toLowerCase() || '';
    const args = parts;
    
    if (commandName) {
      const commands = commandHandler.getAllCommands();
      
      const sendMessage = async (message: string | MessageOptions, tid?: string): Promise<void> => {
        return new Promise((resolve, reject) => {
          const targetThread = tid || threadId;
          api.sendMessage(
            typeof message === 'string' ? message : message,
            targetThread,
            (err: Error | null) => {
              if (err) reject(err);
              else resolve();
            }
          );
        });
      };
      
      const reply = async (message: string | MessageOptions): Promise<void> => {
        return sendMessage(message, threadId);
      };
      
      const context: CommandContext = {
        api,
        event,
        args,
        prefix,
        commands,
        config: config as any,
        sendMessage,
        reply,
      };
      
      await commandHandler.executeCommand(context, commandName);
    }
  }
}

async function handleXP(api: any, senderId: string, threadId: string): Promise<void> {
  const canGainXP = await redis.checkXPCooldown(senderId, config.features.xp.cooldown);
  
  if (!canGainXP) return;
  
  const xpGain = Math.floor(
    Math.random() * (config.features.xp.maxGain - config.features.xp.minGain + 1)
  ) + config.features.xp.minGain;
  
  const result = await database.updateUserXP(senderId, xpGain);
  
  if (result?.leveledUp) {
    BotLogger.xp(senderId, xpGain, result.user.level);
    
    try {
      const userInfo = await new Promise<Record<string, { name: string }>>((resolve, reject) => {
        api.getUserInfo(senderId, (err: Error | null, info: any) => {
          if (err) reject(err);
          else resolve(info);
        });
      });
      
      const userName = userInfo[senderId]?.name || 'User';
      
      const levelUpMessage = `🎉 Congratulations ${userName}!\n\n⭐ You've reached **Level ${result.user.level}**!\n\nKeep chatting to earn more XP!`;
      
      api.sendMessage(levelUpMessage, threadId);
    } catch (error) {
      BotLogger.error('Failed to send level up message', error);
    }
  }
}

async function handleGroupEvent(api: any, event: any): Promise<void> {
  const { logMessageType, logMessageData, threadID } = event;
  
  BotLogger.event(logMessageType, { threadId: threadID, data: logMessageData });
  
  if (logMessageType === 'log:subscribe' && logMessageData?.addedParticipants) {
    if (config.features.welcome.enabled) {
      for (const participant of logMessageData.addedParticipants) {
        const userId = participant.userFbId || participant.id?.split(':').pop();
        const userName = participant.fullName || 'Member';
        
        const welcomeMessage = config.features.welcome.message
          .replace('{name}', userName)
          .replace('{prefix}', prefix);
        
        try {
          api.sendMessage(welcomeMessage, threadID);
          
          await database.logEntry({
            type: 'event',
            level: 'info',
            message: `Welcome sent to ${userName}`,
            threadId: threadID,
            userId,
          });
        } catch (error) {
          BotLogger.error('Failed to send welcome message', error);
        }
      }
    }
  }
  
  if (logMessageType === 'log:unsubscribe' && config.features.autoLeave.logEnabled) {
    const leftUser = logMessageData?.leftParticipantFbId;
    
    await database.logEntry({
      type: 'event',
      level: 'info',
      message: `User ${leftUser} left the group`,
      threadId: threadID,
      userId: leftUser,
    });
  }
}

process.on('uncaughtException', (error) => {
  BotLogger.error('Uncaught exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  BotLogger.error('Unhandled rejection', reason);
});

process.on('SIGINT', async () => {
  BotLogger.shutdown('Received SIGINT, shutting down...');
  await redis.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  BotLogger.shutdown('Received SIGTERM, shutting down...');
  await redis.disconnect();
  process.exit(0);
});

main().catch((error) => {
  BotLogger.error('Failed to start bot', error);
  process.exit(1);
});
