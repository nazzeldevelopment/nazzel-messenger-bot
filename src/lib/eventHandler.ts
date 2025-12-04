import { database } from '../database/index.js';
import { BotLogger } from './logger.js';
import config from '../../config.json' with { type: 'json' };
import { decorations } from './messageFormatter.js';

const prefix = config.bot.prefix;

function getPhilippineTime(): Date {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const philippineOffset = 8 * 60 * 60000;
  return new Date(utc + philippineOffset);
}

function formatDate(date?: Date): string {
  const d = date || getPhilippineTime();
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila'
  };
  return d.toLocaleString('en-PH', options);
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

function getTimeAgo(date: Date): string {
  const now = getPhilippineTime();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  return `${years} year${years > 1 ? 's' : ''} ago`;
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
    memberCount = threadInfo.participantIDs?.length || 0;
    
    const userInfo = await api.getUserInfo(userId);
    if (userInfo[userId]) {
      userProfile = userInfo[userId].name || userName;
    }
  } catch (error) {
    BotLogger.debug(`Failed to get thread/user info: ${error}`);
  }
  
  const joinTime = formatDate();
  const shortTime = formatShortTime();
  const ordinal = getOrdinal(memberCount);
  const greeting = getGreeting();

  const welcomeMessage = `
${decorations.sparkle}${decorations.crown}${decorations.sparkle} WELCOME ${decorations.sparkle}${decorations.crown}${decorations.sparkle}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${decorations.heart} ${greeting}, ${userProfile}!
${decorations.star} Welcome to ${groupName}!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.gem} GROUP INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.globe} Group: ${groupName}
${decorations.star} Members: ${memberCount} members
${decorations.trophy} You are the ${memberCount}${ordinal} member!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.diamond} NEW MEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.ribbon} Name: ${userProfile}
${decorations.lightning} User ID: ${userId}
${decorations.sun} Joined: ${joinTime}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.rocket} GET STARTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
➤ ${prefix}help - View all commands
➤ ${prefix}rules - See group rules
➤ ${prefix}about - Learn about the bot

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.flower} We hope you enjoy your stay!
${decorations.music} ${shortTime}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  
  return welcomeMessage;
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
  let joinedDate = 'Unknown';
  let timeInGroup = 'Unknown';
  let totalMessages = 0;
  let level = 0;
  
  try {
    const threadInfo = await api.getThreadInfo(threadId);
    groupName = threadInfo.name || 'Group Chat';
    memberCount = threadInfo.participantIDs?.length || 0;
    
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
    
    const userDb = await database.getUser(userId);
    if (userDb) {
      if (userDb.joinedAt) {
        joinedDate = formatDate(userDb.joinedAt);
        timeInGroup = getTimeAgo(userDb.joinedAt);
      }
      totalMessages = userDb.totalMessages || 0;
      level = userDb.level || 0;
    }
  } catch (error) {
    BotLogger.debug(`Failed to get thread info: ${error}`);
  }
  
  const leaveTime = formatDate();
  const shortTime = formatShortTime();

  const leaveMessage = `
${decorations.moon}${decorations.leaf}${decorations.moon} GOODBYE ${decorations.moon}${decorations.leaf}${decorations.moon}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${decorations.heart} Farewell, ${userProfile}!
${decorations.star} Left ${groupName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.gem} GROUP STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.globe} Group: ${groupName}
${decorations.star} Remaining: ${memberCount} members

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.diamond} MEMBER INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.ribbon} Name: ${userProfile}
${decorations.lightning} User ID: ${userId}
${decorations.trophy} Level: ${level}
${decorations.music} Messages: ${totalMessages}
${decorations.sun} Left: ${leaveTime}
${decorations.moon} Originally Joined: ${joinedDate}
${decorations.comet} Time in Group: ${timeInGroup}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.flower} We'll miss you! Take care!
${decorations.leaf} ${shortTime}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  
  return leaveMessage;
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export function getAccurateTime(): string {
  return formatDate();
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
