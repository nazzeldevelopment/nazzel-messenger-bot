import { database } from '../database/index.js';
import { BotLogger } from './logger.js';
import config from '../../config.json' with { type: 'json' };

const prefix = config.bot.prefix;

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  return date.toLocaleDateString('en-US', options);
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export async function generateProfessionalWelcome(
  api: any,
  threadId: string,
  userId: string,
  userName: string
): Promise<string> {
  let groupName = 'Group Chat';
  let memberCount = 0;
  let userProfile = '';
  let userProfileUrl = '';
  
  try {
    const threadInfo = await api.getThreadInfo(threadId);
    groupName = threadInfo.name || 'Group Chat';
    memberCount = threadInfo.participantIDs?.length || 0;
    
    const userInfo = await api.getUserInfo(userId);
    if (userInfo[userId]) {
      userProfile = userInfo[userId].name || userName;
      userProfileUrl = userInfo[userId].profileUrl || '';
    }
  } catch (error) {
    BotLogger.debug(`Failed to get thread/user info: ${error}`);
  }
  
  const joinTime = formatDate(new Date());
  const ordinal = getOrdinal(memberCount);
  
  const welcomeMessage = `
╔══════════════════════════════════════╗
║      WELCOME TO THE GROUP!      ║
╠══════════════════════════════════════╣
║                                      ║
║   Hello, ${userProfile}!   ║
║                                      ║
╠══════════════════════════════════════╣
║  GROUP INFO                     ║
╠══════════════════════════════════════╣
║  Group: ${groupName}
║  Members: ${memberCount} members
║  You are the ${memberCount}${ordinal} member!
║                                      ║
╠══════════════════════════════════════╣
║  MEMBER INFO                    ║
╠══════════════════════════════════════╣
║  Name: ${userProfile}
║  User ID: ${userId}
║  Joined: ${joinTime}
║                                      ║
╠══════════════════════════════════════╣
║  QUICK START                    ║
╠══════════════════════════════════════╣
║  Type ${prefix}help to see commands
║  Type ${prefix}rules to see group rules
║  Type ${prefix}about to learn about me
║                                      ║
╠══════════════════════════════════════╣
║                                      ║
║  We hope you enjoy your stay!   ║
║                                      ║
╚══════════════════════════════════════╝`;
  
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
    if (userDb?.joinedAt) {
      joinedDate = formatDate(userDb.joinedAt);
      timeInGroup = getTimeAgo(userDb.joinedAt);
    }
  } catch (error) {
    BotLogger.debug(`Failed to get thread info: ${error}`);
  }
  
  const leaveTime = formatDate(new Date());
  
  const leaveMessage = `
╔══════════════════════════════════════╗
║      MEMBER LEFT THE GROUP      ║
╠══════════════════════════════════════╣
║                                      ║
║   Goodbye, ${userProfile}!   ║
║                                      ║
╠══════════════════════════════════════╣
║  GROUP INFO                     ║
╠══════════════════════════════════════╣
║  Group: ${groupName}
║  Remaining: ${memberCount} members
║                                      ║
╠══════════════════════════════════════╣
║  MEMBER INFO                    ║
╠══════════════════════════════════════╣
║  Name: ${userProfile}
║  User ID: ${userId}
║  Left: ${leaveTime}
║  Originally Joined: ${joinedDate}
║  Time in Group: ${timeInGroup}
║                                      ║
╠══════════════════════════════════════╣
║                                      ║
║  We'll miss you! Take care!     ║
║                                      ║
╚══════════════════════════════════════╝`;
  
  return leaveMessage;
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export const eventHandler = {
  generateProfessionalWelcome,
  generateProfessionalLeave,
};
