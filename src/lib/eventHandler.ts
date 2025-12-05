import { database } from '../database/index.js';
import { BotLogger } from './logger.js';
import config from '../../config.json' with { type: 'json' };

const defaultPrefix = config.bot.prefix;

function getPhilippineTimeString(options: Intl.DateTimeFormatOptions): string {
  return new Date().toLocaleString('en-PH', {
    ...options,
    timeZone: 'Asia/Manila'
  });
}

function getPhilippineHour(): number {
  const timeStr = new Date().toLocaleString('en-US', {
    hour: 'numeric',
    hour12: false,
    timeZone: 'Asia/Manila'
  });
  return parseInt(timeStr, 10);
}

function formatShortTime(): string {
  return getPhilippineTimeString({
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

function formatFullDate(): string {
  return getPhilippineTimeString({
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

function getGreeting(): string {
  const hour = getPhilippineHour();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
}

function getGreetingEmoji(): string {
  const hour = getPhilippineHour();
  if (hour >= 5 && hour < 12) return '🌅';
  if (hour >= 12 && hour < 17) return '☀️';
  if (hour >= 17 && hour < 21) return '🌆';
  return '🌙';
}

function getRandomWelcomeQuote(): string {
  const quotes = [
    "New adventures await!",
    "Great things are coming!",
    "Welcome to the family!",
    "Excited to have you!",
    "Let the fun begin!",
    "Your journey starts here!",
    "Together we're stronger!",
    "Ready to make memories!"
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function getRandomGoodbyeQuote(): string {
  const quotes = [
    "Until we meet again!",
    "Best wishes on your journey!",
    "You'll be missed!",
    "Safe travels, friend!",
    "Hope to see you soon!",
    "Farewell for now!",
    "Take care out there!",
    "Wishing you the best!"
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export async function generateProfessionalWelcome(
  api: any,
  threadId: string,
  userId: string,
  userName: string,
  addedParticipantsCount: number = 1
): Promise<string> {
  let groupName = '';
  let memberCount = 0;
  let userProfile = userName || 'New Member';
  
  try {
    const threadInfo = await api.getThreadInfo(threadId);
    if (threadInfo) {
      groupName = threadInfo.threadName || threadInfo.name || '';
      const participantCount = threadInfo.participantIDs?.length || 
                               threadInfo.participants?.length || 
                               (threadInfo.userInfo?.length) || 0;
      memberCount = participantCount;
    }
    
    try {
      const userInfo = await api.getUserInfo(userId);
      if (userInfo && userInfo[userId]) {
        userProfile = userInfo[userId].name || userInfo[userId].firstName || userName;
      }
    } catch (e) {
      BotLogger.debug(`Could not get user info: ${e}`);
    }
  } catch (error) {
    BotLogger.debug(`Failed to get thread info: ${error}`);
  }
  
  const shortTime = formatShortTime();
  const greeting = getGreeting();
  const greetingEmoji = getGreetingEmoji();
  const quote = getRandomWelcomeQuote();
  
  const customPrefix = await database.getSetting<string>(`prefix_${threadId}`) || defaultPrefix;
  
  const displayGroupName = groupName || 'this group';
  const shortGroupName = displayGroupName.length > 18 ? displayGroupName.substring(0, 15) + '...' : displayGroupName;
  const shortUserProfile = userProfile.length > 18 ? userProfile.substring(0, 15) + '...' : userProfile;
  const memberText = memberCount > 0 ? `${memberCount}` : '?';

  return `╭─────────────────╮
│ ✨ WELCOME ✨
╰─────────────────╯

${greeting}! ${greetingEmoji}

👤 ${shortUserProfile}
🏠 ${shortGroupName}
👥 ${memberText} members
📅 ${shortTime}

💡 ${customPrefix}help - Commands
💡 ${customPrefix}rules - Rules

💫 ${quote}

╭─────────────────╮
│ 💗 Wisdom Bot
╰─────────────────╯`;
}

export async function generateProfessionalLeave(
  api: any,
  threadId: string,
  userId: string,
  userName?: string
): Promise<string> {
  let groupName = '';
  let memberCount = 0;
  let userProfile = userName || 'Member';
  let userLevel = 0;
  let userMessages = 0;
  let userCoins = 0;
  let userXP = 0;
  
  try {
    const threadInfo = await api.getThreadInfo(threadId);
    if (threadInfo) {
      groupName = threadInfo.threadName || threadInfo.name || '';
      const participantCount = threadInfo.participantIDs?.length || 
                               threadInfo.participants?.length || 
                               (threadInfo.userInfo?.length) || 0;
      memberCount = participantCount;
    }
    
    if (!userName || userName === 'Member') {
      try {
        const userInfo = await api.getUserInfo(userId);
        if (userInfo && userInfo[userId]) {
          userProfile = userInfo[userId].name || userInfo[userId].firstName || 'Member';
        }
      } catch (e) {
        BotLogger.debug(`Could not get user info for ${userId}`);
      }
    }
    
    const userData = await database.getUser(userId);
    if (userData) {
      userLevel = userData.level || 0;
      userMessages = userData.totalMessages || 0;
      userCoins = userData.coins || 0;
      userXP = userData.xp || 0;
    }
  } catch (error) {
    BotLogger.debug(`Failed to get thread info: ${error}`);
  }
  
  const shortTime = formatShortTime();
  const quote = getRandomGoodbyeQuote();
  const displayGroupName = groupName || 'this group';
  const shortGroupName = displayGroupName.length > 18 ? displayGroupName.substring(0, 15) + '...' : displayGroupName;
  const shortUserProfile = userProfile.length > 18 ? userProfile.substring(0, 15) + '...' : userProfile;
  const memberText = memberCount > 0 ? `${memberCount}` : '?';

  const xpNeeded = (userLevel + 1) * 100;
  const xpProgress = Math.round((userXP / xpNeeded) * 100);

  return `╭─────────────────╮
│ 👋 GOODBYE 👋
╰─────────────────╯

👤 ${shortUserProfile}
🏠 ${shortGroupName}
👥 ${memberText} remaining
📅 ${shortTime}

🏆 Level ${userLevel} ⭐
✨ ${userXP}/${xpNeeded} XP (${xpProgress}%)
💬 ${userMessages} msgs
💰 ${userCoins} coins

💫 ${quote}

🌸 Take care! See you! 🌸

╭─────────────────╮
│ 💗 Wisdom Bot
╰─────────────────╯`;
}

export function getAccurateTime(): string {
  return getPhilippineTimeString({
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

export function getAccurateShortTime(): string {
  return formatShortTime();
}

export function getPhilippineDateTime(): Date {
  return new Date();
}

export const eventHandler = {
  generateProfessionalWelcome,
  generateProfessionalLeave,
  getAccurateTime,
  getAccurateShortTime,
  getPhilippineDateTime,
};
