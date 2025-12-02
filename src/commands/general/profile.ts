import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';

const command: Command = {
  name: 'profile',
  aliases: ['me', 'user', 'userinfo'],
  description: 'Display your profile or another user\'s profile',
  category: 'general',
  usage: 'profile [@mention|userID]',
  examples: ['profile', 'profile @user'],

  async execute(context: CommandContext): Promise<void> {
    const { api, event, args, reply } = context;
    
    let targetId = event.senderID;
    
    if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = Object.keys(event.mentions)[0];
    } else if (args[0] && /^\d+$/.test(args[0])) {
      targetId = args[0];
    }
    
    try {
      const userInfo = await new Promise<Record<string, { name: string; profileUrl: string; thumbSrc: string; gender: string }>>((resolve, reject) => {
        api.getUserInfo(targetId, (err: Error | null, info: Record<string, { name: string; profileUrl: string; thumbSrc: string; gender: string }>) => {
          if (err) reject(err);
          else resolve(info);
        });
      });
      
      const info = userInfo[targetId];
      if (!info) {
        await reply('❌ Could not find user information.');
        return;
      }
      
      const userData = await database.getOrCreateUser(targetId, info.name);
      
      const level = userData?.level || 0;
      const xp = userData?.xp || 0;
      const totalMessages = userData?.totalMessages || 0;
      const xpForNextLevel = (level + 1) * 100;
      const progressBar = createProgressBar(xp, xpForNextLevel);
      
      const response = `╔═══════════════════════════════╗
║ 👤 USER PROFILE
╠═══════════════════════════════╣
║ Name: ${info.name}
║ ID: ${targetId}
║ Gender: ${info.gender === '2' ? '👨 Male' : info.gender === '1' ? '👩 Female' : '❓ Unknown'}
╠═══════════════════════════════╣
║ ⭐ LEVEL STATS
╠═══════════════════════════════╣
║ Level: ${level}
║ XP: ${xp}/${xpForNextLevel}
║ ${progressBar}
║ Total Messages: ${totalMessages}
╠═══════════════════════════════╣
║ 🔗 Profile Link:
║ ${info.profileUrl || `https://facebook.com/${targetId}`}
╚═══════════════════════════════╝`;
      
      await reply(response);
    } catch (error) {
      await reply('❌ Failed to fetch user profile.');
    }
  }
};

function createProgressBar(current: number, max: number, length: number = 10): string {
  const percentage = Math.min(current / max, 1);
  const filled = Math.round(percentage * length);
  const empty = length - filled;
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${Math.round(percentage * 100)}%`;
}

export default command;
