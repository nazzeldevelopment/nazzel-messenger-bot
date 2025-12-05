import 'dotenv/config';
import fs from 'fs';
import login from '@dongdev/fca-unofficial';
import { BotLogger, logger } from './lib/logger.js';
import { commandHandler } from './lib/commandHandler.js';
import { database, initDatabase } from './database/index.js';
import { redis } from './lib/redis.js';
import { antiSpam } from './lib/antiSpam.js';
import { createServer, startServer } from './services/server.js';
import { eventHandler } from './lib/eventHandler.js';
import { maintenance } from './lib/maintenance.js';
import { badWordsFilter } from './lib/badwords.js';
import config from '../config.json' with { type: 'json' };
import type { CommandContext, MessageOptions } from './types/index.js';

const APPSTATE_FILE = './appstate.json';
const prefix = config.bot.prefix;

async function main(): Promise<void> {
  console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   ███╗   ██╗ █████╗ ███████╗███████╗███████╗██╗         ██████╗  ██████╗ ████████╗   ║
║   ████╗  ██║██╔══██╗╚══███╔╝╚══███╔╝██╔════╝██║         ██╔══██╗██╔═══██╗╚══██╔══╝   ║
║   ██╔██╗ ██║███████║  ███╔╝   ███╔╝ █████╗  ██║         ██████╔╝██║   ██║   ██║      ║
║   ██║╚██╗██║██╔══██║ ███╔╝   ███╔╝  ██╔══╝  ██║         ██╔══██╗██║   ██║   ██║      ║
║   ██║ ╚████║██║  ██║███████╗███████╗███████╗███████╗    ██████╔╝╚██████╔╝   ██║      ║
║   ╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚══════╝    ╚═════╝  ╚═════╝    ╚═╝      ║
║                                                                              ║
║          Advanced Facebook Messenger User-Bot | TypeScript Edition           ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);
  
  BotLogger.startup(`Starting ${config.bot.name} v${config.bot.version}`);
  
  console.log('═════════════════════ INITIALIZING SYSTEMS ═════════════════════');
  
  const dbInitialized = await initDatabase();
  
  if (!dbInitialized) {
    BotLogger.warn('MongoDB not connected. Database features will be disabled.');
    BotLogger.info('Set MONGODB_URI environment variable to enable database.');
  } else {
    console.log('  [DATABASE]        MongoDB connected successfully');
  }
  
  await redis.connect();
  if (redis.connected) {
    console.log('  [CACHE]           Redis connected successfully');
  }
  
  console.log('═══════════════════════ LOADING MODULES ════════════════════════');
  
  await commandHandler.loadCommands();
  const commandCount = commandHandler.getAllCommands().size;
  const categories = commandHandler.getCategories();
  
  console.log(`  [COMMANDS]        Loaded ${commandCount} commands in ${categories.length} categories`);
  for (const category of categories) {
    const count = commandHandler.getCommandsByCategory(category).length;
    console.log(`                    - ${category}: ${count} commands`);
  }
  
  console.log('  [MODERATION]      Bad words filter loaded');
  console.log('  [MAINTENANCE]     Maintenance system ready');
  console.log('  [EVENTS]          Event handlers initialized');
  
  console.log('═════════════════════ STARTING SERVICES ═════════════════════════');
  
  const app = createServer();
  startServer(app);
  console.log(`  [SERVER]          Express running on port ${config.server.port}`);
  console.log(`  [DASHBOARD]       http://0.0.0.0:${config.server.port}`);
  
  let appState: any = null;
  let appStateSource = '';
  
  const dbAppstate = await database.getAppstate();
  if (dbAppstate && Array.isArray(dbAppstate) && dbAppstate.length > 0) {
    appState = dbAppstate;
    appStateSource = 'database';
    console.log('  [APPSTATE]        Loaded from database (persistent)');
  }
  
  if (!appState && fs.existsSync(APPSTATE_FILE)) {
    try {
      const fileContent = fs.readFileSync(APPSTATE_FILE, 'utf8');
      if (fileContent && fileContent.trim().length > 2) {
        appState = JSON.parse(fileContent);
        appStateSource = 'file';
        console.log('  [APPSTATE]        Loaded from file');
        
        await database.saveAppstate(appState);
        console.log('  [APPSTATE]        Synced to database');
      } else {
        console.log('  [APPSTATE]        File exists but is empty');
      }
    } catch (error) {
      console.log('  [APPSTATE]        Error loading from file');
    }
  } else if (!appState) {
    console.log('  [APPSTATE]        Not found in database or file');
  }
  
  const credentials = { appState };
  
  const loginOptions = {
    selfListen: config.bot.selfListen,
    listenEvents: config.bot.listenEvents,
    updatePresence: true,
    autoMarkRead: config.bot.autoMarkRead,
    autoMarkDelivery: config.bot.autoMarkDelivery,
    forceLogin: true,
    database: false,
    backup: false,
    logging: false,
  };
  
  if (!appState || (Array.isArray(appState) && appState.length === 0)) {
    console.log('═══════════════════════ WARNING ════════════════════════════════');
    console.log('  No valid appstate found.');
    console.log('  Please provide a valid appstate.json file with Facebook cookies.');
    console.log('  The Express server is running. Bot will not connect to Messenger.');
    console.log('═════════════════════════════════════════════════════════════════');
    return;
  }
  
  console.log('════════════════════ CONNECTING TO FACEBOOK ═════════════════════');
  console.log('  [LOGIN]           Attempting Facebook login...');
  
  login(credentials, loginOptions, async (err: any, api: any) => {
    if (err) {
      BotLogger.error('Login failed', err);
      
      if (err.error === 'login-approval') {
        console.log('  [LOGIN]           Two-factor authentication required.');
        console.log('                    Please approve the login from your phone.');
      }
      
      return;
    }
    
    const currentUserId = api.getCurrentUserID();
    
    let botName = 'Unknown';
    try {
      const userInfo = await api.getUserInfo(currentUserId);
      botName = userInfo[currentUserId]?.name || 'Unknown';
    } catch (error) {}
    
    console.log('═════════════════════ LOGIN SUCCESSFUL ═════════════════════════');
    console.log(`  [ACCOUNT]         ${botName}`);
    console.log(`  [USER ID]         ${currentUserId}`);
    
    try {
      const newAppState = api.getAppState();
      if (newAppState && newAppState.length > 0) {
        fs.writeFileSync(APPSTATE_FILE, JSON.stringify(newAppState, null, 2));
        
        const dbSaved = await database.saveAppstate(newAppState);
        console.log(`  [APPSTATE]        Saved to ${dbSaved ? 'file and database' : 'file only'}`);
      }
    } catch (error) {
      console.log('  [APPSTATE]        Failed to save');
    }
    
    api.setOptions({
      selfListen: config.bot.selfListen,
      listenEvents: config.bot.listenEvents,
      autoMarkRead: config.bot.autoMarkRead,
      autoMarkDelivery: config.bot.autoMarkDelivery,
      forceLogin: true,
    });
    
    console.log('══════════════════════ BOT INFORMATION ═════════════════════════');
    console.log(`  [NAME]            ${config.bot.name}`);
    console.log(`  [VERSION]         ${config.bot.version}`);
    console.log(`  [PREFIX]          ${prefix}`);
    console.log(`  [COMMANDS]        ${commandCount} commands loaded`);
    console.log(`  [NODE]            ${process.version}`);
    
    console.log('═══════════════════════ BOT STARTED ════════════════════════════');
    console.log('  [STATUS]          Bot is now online and listening for messages');
    console.log('  [FEATURES]        Welcome/Leave messages enabled');
    console.log('  [FEATURES]        Bad words filter ready');
    console.log('  [FEATURES]        Maintenance mode available');
    console.log('═════════════════════════════════════════════════════════════════');
    
    const stopListening = api.listenMqtt(async (err: any, event: any) => {
      if (err) {
        BotLogger.error('Listen error', err);
        if (err && (err.type === 'stop_listening' || err.error === 'Connection closed')) {
          BotLogger.warn('MQTT connection lost, attempting to reconnect...');
        }
        return;
      }
      
      if (!event) {
        return;
      }
      
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
    
    if (stopListening) {
      BotLogger.info('MQTT listener started successfully');
    }
  });
}

function normalizeId(id: any): string {
  if (id === null || id === undefined) return '';
  return ('' + id).trim();
}

async function handleEvent(api: any, event: any): Promise<void> {
  if (event.threadID) event.threadID = normalizeId(event.threadID);
  if (event.senderID) event.senderID = normalizeId(event.senderID);
  if (event.userID) event.userID = normalizeId(event.userID);
  if (event.messageID) event.messageID = normalizeId(event.messageID);
  if (event.messageReply?.senderID) event.messageReply.senderID = normalizeId(event.messageReply.senderID);
  if (event.messageReply?.messageID) event.messageReply.messageID = normalizeId(event.messageReply.messageID);
  if (event.participantIDs && Array.isArray(event.participantIDs)) {
    event.participantIDs = event.participantIDs.map((id: any) => normalizeId(id));
  }
  
  switch (event.type) {
    case 'message':
    case 'message_reply':
      await handleMessage(api, event);
      break;
      
    case 'event':
      await handleGroupEvent(api, event);
      break;
      
    case 'message_reaction':
      break;
      
    case 'typ':
    case 'read_receipt':
      break;
      
    default:
      break;
  }
}

async function handleMessage(api: any, event: any): Promise<void> {
  const body = event.body || '';
  const threadId = String(event.threadID);
  const senderId = String(event.senderID);
  const currentUserId = String(api.getCurrentUserID());
  
  if (!body.trim()) return;
  
  const isSelfMessage = senderId === currentUserId;
  
  await database.logEntry({
    type: 'message',
    level: 'info',
    message: body.substring(0, 200),
    threadId,
    userId: senderId,
  });
  
  if (!isSelfMessage) {
    const detection = await badWordsFilter.detectBadContent(body, threadId);
    if (detection.detected) {
      const settings = await badWordsFilter.getSettings(threadId);
      const warnings = await badWordsFilter.addUserWarning(senderId, threadId);
      
      if (settings.action === 'warn' && detection.message) {
        try {
          await api.sendMessage(
            `${detection.message}\n\nWarning ${warnings}/3 - Further violations may result in action.`,
            threadId
          );
        } catch (e) {}
      }
      
      await database.logEntry({
        type: 'moderation',
        level: 'warn',
        message: `Bad content detected: ${detection.type}`,
        threadId,
        userId: senderId,
        metadata: { matches: detection.matches, severity: detection.severity },
      });
    }
  }
  
  if (config.features.xp.enabled && !isSelfMessage) {
    await handleXP(api, senderId, threadId);
  }
  
  const customPrefix = await database.getSetting<string>(`prefix_${threadId}`) || prefix;
  
  if (body.startsWith(customPrefix)) {
    const maintenanceData = await maintenance.getMaintenanceData();
    const ownerId = process.env.OWNER_ID;
    const isOwner = ownerId && senderId === ownerId;
    
    if (maintenanceData?.enabled && !isOwner) {
      const hasNotified = maintenanceData.notifiedGroups.includes(threadId);
      if (!hasNotified) {
        try {
          await api.sendMessage(maintenance.generateMaintenanceMessage(maintenanceData), threadId);
          await maintenance.addNotifiedGroup(threadId);
        } catch (e) {}
      }
      return;
    }
    
    const raw = body.slice(customPrefix.length).trim();
    const parts = raw.split(/\s+/);
    const commandName = parts.shift()?.toLowerCase() || '';
    const args = parts;
    
    if (commandName) {
      const commands = commandHandler.getAllCommands();
      
      const sendMessage = async (message: string | MessageOptions, tid?: string): Promise<void> => {
        const targetThread = normalizeId(tid || threadId);
        
        let messageContent: any;
        if (typeof message === 'string') {
          messageContent = message;
        } else {
          messageContent = { ...message };
          if (messageContent.body) messageContent.body = String(messageContent.body);
        }
        
        const startTime = Date.now();
        
        const sendWithRetry = async (attempt: number = 1): Promise<{ success: boolean; error?: Error; messageInfo?: any }> => {
          try {
            const messageInfo = await api.sendMessage(messageContent, targetThread);
            return { success: true, messageInfo };
          } catch (e) {
            return { success: false, error: e as Error };
          }
        };
        
        let result = await sendWithRetry(1);
        
        if (!result.success) {
          await new Promise(r => setTimeout(r, 1000));
          result = await sendWithRetry(2);
        }
        
        if (!result.success) {
          await new Promise(r => setTimeout(r, 2000));
          result = await sendWithRetry(3);
        }
        
        const elapsed = Date.now() - startTime;
        
        if (!result.success) {
          BotLogger.error(`Failed to send message after 3 attempts (${elapsed}ms): ${result.error?.message}`);
        }
      };
      
      const reply = async (message: string | MessageOptions): Promise<void> => {
        return sendMessage(message, threadId);
      };
      
      const context: CommandContext = {
        api,
        event,
        args,
        prefix: customPrefix,
        commands,
        config: config as any,
        sendMessage,
        reply,
      };
      
      try {
        await commandHandler.executeCommand(context, commandName);
      } catch (error) {
        BotLogger.error(`Command execution failed: ${commandName}`, error);
        try {
          await reply(`An error occurred while executing the command. Please try again.`);
        } catch (replyError) {}
      }
    }
  }
}

async function handleXP(api: any, senderId: string, threadId: string): Promise<void> {
  const senderIdStr = normalizeId(senderId);
  const threadIdStr = normalizeId(threadId);
  
  const xpCheck = await antiSpam.checkXpCooldown(senderIdStr, config.features.xp.cooldown);
  
  if (xpCheck.onCooldown) return;
  
  const xpGain = Math.floor(
    Math.random() * (config.features.xp.maxGain - config.features.xp.minGain + 1)
  ) + config.features.xp.minGain;
  
  const result = await database.updateUserXP(senderIdStr, xpGain);
  
  if (result?.leveledUp) {
    try {
      const userInfo = await api.getUserInfo(senderIdStr);
      const userName = userInfo[senderIdStr]?.name || 'User';
      
      const levelUpMessage = `🎉 LEVEL UP!
━━━━━━━━━━━━━━━
👤 ${userName}
🏆 Level ${result.user.level}
━━━━━━━━━━━━━━━`;
      
      try {
        await api.sendMessage(levelUpMessage, threadIdStr);
      } catch (err) {}
    } catch (error) {}
  }
}

async function handleGroupEvent(api: any, event: any): Promise<void> {
  const { logMessageType, logMessageData, threadID } = event;
  const threadIdStr = normalizeId(threadID);
  
  if (logMessageType === 'log:subscribe' && logMessageData?.addedParticipants) {
    if (config.features.welcome.enabled) {
      for (const participant of logMessageData.addedParticipants) {
        const userId = normalizeId(participant.userFbId || participant.id?.split(':').pop() || '');
        const userName = participant.fullName || 'Member';
        
        try {
          const welcomeMessage = await eventHandler.generateProfessionalWelcome(
            api,
            threadIdStr,
            userId,
            userName
          );
          
          await api.sendMessage(welcomeMessage, threadIdStr);
          
          await database.logEntry({
            type: 'event',
            level: 'info',
            message: `Welcome sent to ${userName}`,
            threadId: threadIdStr,
            userId,
          });
        } catch (error) {
          BotLogger.error('Failed to send welcome message', error);
        }
      }
    }
  }
  
  if (logMessageType === 'log:unsubscribe') {
    const leftUser = normalizeId(logMessageData?.leftParticipantFbId || '');
    
    if (config.features.autoLeave.logEnabled) {
      try {
        let userName = 'Member';
        try {
          const userInfo = await api.getUserInfo(leftUser);
          userName = userInfo[leftUser]?.name || 'Member';
        } catch (e) {}
        
        const leaveMessage = await eventHandler.generateProfessionalLeave(
          api,
          threadIdStr,
          leftUser,
          userName
        );
        
        await api.sendMessage(leaveMessage, threadIdStr);
        
        await database.logEntry({
          type: 'event',
          level: 'info',
          message: `User ${userName} left the group`,
          threadId: threadIdStr,
          userId: leftUser,
        });
      } catch (error) {
        BotLogger.error('Failed to send leave message', error);
      }
    }
    
    const antiLeaveEnabled = await database.getSetting<boolean>(`antileave_${threadIdStr}`);
    if (antiLeaveEnabled && leftUser) {
      BotLogger.info(`Anti-leave triggered: Adding ${leftUser} back to ${threadIdStr}`);
      try {
        await api.addUserToGroup(leftUser, threadIdStr);
        
        const userInfo = await api.getUserInfo(leftUser);
        const userName = userInfo[leftUser]?.name || 'Member';
        
        await api.sendMessage(`🔄 ANTI-LEAVE
━━━━━━━━━━━━━━━
✅ ${userName} added back
━━━━━━━━━━━━━━━`, threadIdStr);
        
        await database.logEntry({
          type: 'event',
          level: 'info',
          message: `Anti-leave: Added ${userName} back to group`,
          threadId: threadIdStr,
          userId: leftUser,
        });
      } catch (error) {
        BotLogger.error(`Failed to add ${leftUser} back to group`, error);
      }
    }
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
  console.log('\n═══════════════════════ SHUTTING DOWN ═══════════════════════════');
  console.log('  [STATUS]          Received shutdown signal');
  await redis.disconnect();
  await database.disconnect();
  console.log('  [STATUS]          Cleanup complete. Goodbye!');
  console.log('═════════════════════════════════════════════════════════════════');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n═══════════════════════ SHUTTING DOWN ═══════════════════════════');
  console.log('  [STATUS]          Received termination signal');
  await redis.disconnect();
  await database.disconnect();
  console.log('  [STATUS]          Cleanup complete. Goodbye!');
  console.log('═════════════════════════════════════════════════════════════════');
  process.exit(0);
});

main().catch((error) => {
  BotLogger.error('Failed to start bot', error);
  process.exit(1);
});
