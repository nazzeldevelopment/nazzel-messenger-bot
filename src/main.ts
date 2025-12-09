import 'dotenv/config';
import fs from 'fs';
import { BituinFCA } from '@nazzelofficial/bituin-fca';
import { BotLogger, logger } from './lib/logger.js';
import { commandHandler } from './lib/commandHandler.js';
import { database, initDatabase } from './database/index.js';
import { redis } from './lib/redis.js';
import { antiSpam } from './lib/antiSpam.js';
import { createServer, startServer } from './services/server.js';
import { eventHandler } from './lib/eventHandler.js';
import { maintenance } from './lib/maintenance.js';
import { badWordsFilter } from './lib/badwords.js';
import { isOwner, canAccessLockedGroup } from './lib/permissions.js';
import config from '../config.json' with { type: 'json' };
import type { CommandContext, MessageOptions } from './types/index.js';

const APPSTATE_FILE = './appstate.json';
const prefix = config.bot.prefix;

const recentEvents = new Map<string, number>();
const EVENT_DEBOUNCE_MS = 30000;

// Message deduplication to prevent duplicate processing (FCA may emit same message twice)
const processedMessages = new Map<string, number>();
const MESSAGE_DEBOUNCE_MS = 5000;
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 30000;

function isMessageDuplicate(messageId: string): boolean {
  if (!messageId) return false;
  
  const now = Date.now();
  const lastTime = processedMessages.get(messageId);
  
  if (lastTime && (now - lastTime) < MESSAGE_DEBOUNCE_MS) {
    return true;
  }
  
  processedMessages.set(messageId, now);
  
  // Cleanup only every 30 seconds to avoid O(n) on every message
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    lastCleanup = now;
    for (const [key, time] of processedMessages.entries()) {
      if (now - time > MESSAGE_DEBOUNCE_MS * 2) {
        processedMessages.delete(key);
      }
    }
    // Hard limit on size
    if (processedMessages.size > 500) {
      const keysToDelete = Array.from(processedMessages.keys()).slice(0, 200);
      keysToDelete.forEach(key => processedMessages.delete(key));
    }
  }
  
  return false;
}

function isEventDuplicate(eventKey: string): boolean {
  const now = Date.now();
  const lastTime = recentEvents.get(eventKey);
  
  if (lastTime && (now - lastTime) < EVENT_DEBOUNCE_MS) {
    return true;
  }
  
  recentEvents.set(eventKey, now);
  
  for (const [key, time] of recentEvents.entries()) {
    if (now - time > EVENT_DEBOUNCE_MS * 2) {
      recentEvents.delete(key);
    }
  }
  
  if (recentEvents.size > 500) {
    const keysToDelete = Array.from(recentEvents.keys()).slice(0, 100);
    keysToDelete.forEach(key => recentEvents.delete(key));
  }
  
  return false;
}

async function main(): Promise<void> {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║  ██╗    ██╗██╗███████╗██████╗  ██████╗ ███╗   ███╗    ██████╗  ██████╗ ████████╗ ║
║  ██║    ██║██║██╔════╝██╔══██╗██╔═══██╗████╗ ████║    ██╔══██╗██╔═══██╗╚══██╔══╝ ║
║  ██║ █╗ ██║██║███████╗██║  ██║██║   ██║██╔████╔██║    ██████╔╝██║   ██║   ██║    ║
║  ██║███╗██║██║╚════██║██║  ██║██║   ██║██║╚██╔╝██║    ██╔══██╗██║   ██║   ██║    ║
║  ╚███╔███╔╝██║███████║██████╔╝╚██████╔╝██║ ╚═╝ ██║    ██████╔╝╚██████╔╝   ██║    ║
║   ╚══╝╚══╝ ╚═╝╚══════╝╚═════╝  ╚═════╝ ╚═╝     ╚═╝    ╚═════╝  ╚═════╝    ╚═╝    ║
║                                                                               ║
║            Advanced Facebook Messenger User-Bot | TypeScript Edition          ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`);
  
  BotLogger.startup(`Starting ${config.bot.name} v${config.bot.version}`);
  
  console.log('═════════════════════ INITIALIZING SYSTEMS ═════════════════════');
  
  const dbInitialized = await initDatabase();
  
  if (!dbInitialized) {
    BotLogger.warn('MongoDB not connected. Database features will be disabled.');
    BotLogger.info('Set MONGODB_URI environment variable to enable database.');
  } else {
    console.log('  [DATABASE]        MongoDB connected successfully');
    
    // Check for shutdown flag - prevents auto-restart after shutdown command
    // Only runs if FORCE_START env is not set (for redeployment)
    if (process.env.FORCE_START !== 'true') {
      try {
        const isShutdown = await database.getSetting<boolean>('bot_shutdown');
        if (isShutdown === true) {
          const shutdownTime = await database.getSetting<string>('bot_shutdown_time') || 'Unknown';
          console.log('');
          console.log('═══════════════════════ SHUTDOWN FLAG DETECTED ═══════════════════');
          console.log('  [STATUS]          Bot was shutdown via command');
          console.log(`  [TIME]            ${shutdownTime}`);
          console.log('  [ACTION]          Refusing to start');
          console.log('');
          console.log('  To restart the bot:');
          console.log('    1. Redeploy on your hosting platform (Koyeb, Railway, etc.)');
          console.log('    2. Or set FORCE_START=true in environment variables');
          console.log('═════════════════════════════════════════════════════════════════');
          console.log('');
          
          // Keep process alive but do nothing - prevents restart loops
          // Hosting will see process is running but bot is not active
          await new Promise(() => {});
        }
      } catch (e) {
        // No shutdown flag set, continue normally
      }
    } else {
      // FORCE_START is set, clear the shutdown flag
      console.log('  [FORCE_START]     Clearing shutdown flag (FORCE_START=true)');
      try {
        await database.setSetting('bot_shutdown', false);
      } catch (e) {
        // Ignore
      }
    }
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
    online: true,
    autoReconnect: true,
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
  
  const bot = new BituinFCA({
    appStatePath: APPSTATE_FILE,
    commandPrefix: prefix,
    enableAntiBan: true,
    enableCommands: false,
    enablePlugins: false,
  });
  
  try {
    const loginSuccess = await bot.loginWithAppState();
    
    if (!loginSuccess) {
      BotLogger.error('Login failed', 'Could not authenticate with Facebook');
      console.log('  [LOGIN]           Login failed. Please check your appstate.');
      return;
    }
    
    const api = (bot as any).api || bot;
    const currentUserId = api.getCurrentUserID ? api.getCurrentUserID() : 'unknown';
    
    let botName = 'Unknown';
    try {
      if (api.getUserInfo) {
        const userInfo = await api.getUserInfo(currentUserId);
        botName = userInfo[currentUserId]?.name || 'Unknown';
      }
    } catch (error) {}
    
    console.log('═════════════════════ LOGIN SUCCESSFUL ═════════════════════════');
    console.log(`  [ACCOUNT]         ${botName}`);
    console.log(`  [USER ID]         ${currentUserId}`);
    
    try {
      if (api.getAppState) {
        const newAppState = api.getAppState();
        if (newAppState && newAppState.length > 0) {
          fs.writeFileSync(APPSTATE_FILE, JSON.stringify(newAppState, null, 2));
          
          const dbSaved = await database.saveAppstate(newAppState);
          console.log(`  [APPSTATE]        Saved to ${dbSaved ? 'file and database' : 'file only'}`);
        }
      } else {
        await bot.saveAppState();
        console.log('  [APPSTATE]        Saved via BituinFCA');
      }
    } catch (error) {
      console.log('  [APPSTATE]        Failed to save');
    }
    
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
    
    bot.on('message', async (event: any) => {
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
    
    BotLogger.info('BituinFCA message listener started successfully');
    
  } catch (err: any) {
    BotLogger.error('Login failed', err);
    
    if (err?.error === 'login-approval') {
      console.log('  [LOGIN]           Two-factor authentication required.');
      console.log('                    Please approve the login from your phone.');
    }
  }
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
  const messageId = String(event.messageID || '');
  const currentUserId = String(api.getCurrentUserID());
  
  if (!body.trim()) return;
  
  // Check for duplicate message (FCA may emit same message twice as message + message_reply)
  if (messageId && isMessageDuplicate(messageId)) {
    BotLogger.debug(`Duplicate message ignored: ${messageId}`);
    return;
  }
  
  const isSelfMessage = senderId === currentUserId;
  const customPrefix = await database.getSetting<string>(`prefix_${threadId}`) || prefix;
  
  // Check if group is locked FIRST - before any other processing
  if (!isSelfMessage) {
    const lockKey = `locked_${threadId}`;
    const isLocked = await database.getSetting(lockKey);
    
    if (isLocked === 'true') {
      const canAccess = await canAccessLockedGroup(senderId, api, threadId);
      if (!canAccess) {
        return;
      }
    }
  }
  
  // Log message after lock check
  await database.logEntry({
    type: 'message',
    level: 'info',
    message: body.substring(0, 200),
    threadId,
    userId: senderId,
  });
  
  // Bad words filter (only for non-self messages)
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
  
  if (body.startsWith(customPrefix)) {
    const maintenanceData = await maintenance.getMaintenanceData();
    
    if (maintenanceData?.enabled && !isOwner(senderId)) {
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
        
        try {
          const messageInfo = await api.sendMessage(messageContent, targetThread);
          
          if (messageInfo?.messageID) {
            const botMessagesKey = `bot_messages_${targetThread}`;
            const storedMessages = await database.getSetting<string[]>(botMessagesKey) || [];
            storedMessages.push(messageInfo.messageID);
            if (storedMessages.length > 100) {
              storedMessages.splice(0, storedMessages.length - 100);
            }
            await database.setSetting(botMessagesKey, storedMessages);
          }
        } catch (e) {
          BotLogger.error(`Failed to send message: ${(e as Error).message}`);
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
        
        const eventKey = `welcome_${threadIdStr}_${userId}`;
        if (isEventDuplicate(eventKey)) {
          BotLogger.debug(`Duplicate welcome event ignored for ${userName} in ${threadIdStr}`);
          continue;
        }
        
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
    
    const leaveEventKey = `leave_${threadIdStr}_${leftUser}`;
    if (isEventDuplicate(leaveEventKey)) {
      BotLogger.debug(`Duplicate leave event ignored for ${leftUser} in ${threadIdStr}`);
      return;
    }
    
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
