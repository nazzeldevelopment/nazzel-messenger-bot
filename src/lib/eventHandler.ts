import { database } from '../database/index.js';
import { BotLogger } from './logger.js';
import config from '../../config.json' with { type: 'json' };

const prefix = config.bot.prefix;

function getPhilippineTime(): Date {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const philippineOffset = 8 * 60 * 60000;
  return new Date(utc + philippineOffset);
}

function formatShortTime(): string {
  const d = getPhilippineTime();
  return d.toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila'
  });
}

function getGreeting(): string {
  const hour = getPhilippineTime().getHours();
  if (hour >= 5 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
}

export async function generateProfessionalWelcome(
  api: any,
  threadId: string,
  userId: string,
  userName: string
): Promise<string> {
  let groupName = 'Group Chat';
  let memberCount = 0;
  let userProfile = userName || 'New Member';
  
  try {
    const threadInfo = await api.getThreadInfo(threadId);
    groupName = threadInfo.name || 'Group Chat';
    memberCount = threadInfo.participantIDs?.length || threadInfo.participants?.length || 0;
    
    const userInfo = await api.getUserInfo(userId);
    if (userInfo[userId]) {
      userProfile = userInfo[userId].name || userName;
    }
  } catch (error) {
    BotLogger.debug(`Failed to get thread/user info: ${error}`);
  }
  
  const shortTime = formatShortTime();
  const greeting = getGreeting();

  return `✨ WELCOME ✨
━━━━━━━━━━━━━━━
💫 ${greeting}, ${userProfile}!
🏠 ${groupName}
👥 Members: ${memberCount}
━━━━━━━━━━━━━━━
📌 ${prefix}help - Commands
⏰ ${shortTime}`;
}

export async function generateProfessionalLeave(
  api: any,
  threadId: string,
  userId: string,
  userName?: string
): Promise<string> {
  let groupName = 'Group Chat';
  let memberCount = 0;
  let userProfile = userName || 'Member';
  
  try {
    const threadInfo = await api.getThreadInfo(threadId);
    groupName = threadInfo.name || 'Group Chat';
    memberCount = threadInfo.participantIDs?.length || threadInfo.participants?.length || 0;
    
    if (!userName) {
      try {
        const userInfo = await api.getUserInfo(userId);
        if (userInfo[userId]) {
          userProfile = userInfo[userId].name || 'Member';
        }
      } catch (e) {
        BotLogger.debug(`Could not get user info for ${userId}`);
      }
    }
  } catch (error) {
    BotLogger.debug(`Failed to get thread info: ${error}`);
  }
  
  const shortTime = formatShortTime();

  return `👋 GOODBYE
━━━━━━━━━━━━━━━
💔 ${userProfile} left
🏠 ${groupName}
👥 Remaining: ${memberCount}
━━━━━━━━━━━━━━━
🌸 Take care!
⏰ ${shortTime}`;
}

export function getAccurateTime(): string {
  const d = getPhilippineTime();
  return d.toLocaleString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila'
  });
}

export function getAccurateShortTime(): string {
  return formatShortTime();
}

export function getPhilippineDateTime(): Date {
  return getPhilippineTime();
}

export const eventHandler = {
  generateProfessionalWelcome,
  generateProfessionalLeave,
  getAccurateTime,
  getAccurateShortTime,
  getPhilippineDateTime,
};
