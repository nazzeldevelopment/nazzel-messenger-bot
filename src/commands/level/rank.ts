import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';

export const command: Command = {
  name: 'rank',
  aliases: ['position', 'standing'],
  description: 'See your rank on the leaderboard',
  category: 'level',
  usage: 'rank [@mention]',
  examples: ['rank', 'rank @user'],
  cooldown: 5,

  async execute({ api, event, args, reply }) {
    let targetId = ('' + event.senderID).trim();
    
    if (event.messageReply) {
      targetId = ('' + event.messageReply.senderID).trim();
    } else if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = ('' + Object.keys(event.mentions)[0]).trim();
    } else if (args[0]) {
      const parsed = args[0].replace(/[^0-9]/g, '');
      targetId = parsed ? ('' + parsed).trim() : ('' + event.senderID).trim();
    }

    try {
      const userInfo = await api.getUserInfo(targetId);
      const userName = userInfo[targetId]?.name || 'Unknown User';
      
      const user = await database.getOrCreateUser(targetId, userName);
      
      if (!user) {
        await reply('❌ Could not fetch user data. Please try again.');
        return;
      }

      const leaderboard = await database.getLeaderboard(100);
      const userIndex = leaderboard.findIndex(u => u.id === targetId);
      const rank = userIndex >= 0 ? userIndex + 1 : leaderboard.length + 1;
      const totalUsers = await database.getTotalUsers();
      const xpForNextLevel = (user.level + 1) * 100;
      const progress = Math.round((user.xp / xpForNextLevel) * 100);
      const progressBar = createProgressBar(user.xp, xpForNextLevel, 10);

      let rankEmoji = '📊';
      if (rank === 1) rankEmoji = '🥇';
      else if (rank === 2) rankEmoji = '🥈';
      else if (rank === 3) rankEmoji = '🥉';
      else if (rank <= 10) rankEmoji = '🏅';

      const message = `╔═══════════════════════════════╗
║ ⭐ LEVEL STATS
╠═══════════════════════════════╣
║ 👤 ${userName}
╠═══════════════════════════════╣
║ 🏆 Level: ${user.level}
║ ✨ XP: ${user.xp}/${xpForNextLevel}
║ 📊 ${progressBar} ${progress}%
║ ${rankEmoji} Rank: #${rank}
║ 💬 Messages: ${user.totalMessages}
╚═══════════════════════════════╝`;

      await reply(message);
    } catch (error) {
      await reply('❌ Failed to get rank information. Please try again.');
    }
  },
};

function createProgressBar(current: number, max: number, length: number = 10): string {
  const percentage = Math.min(current / max, 1);
  const filled = Math.round(percentage * length);
  const empty = length - filled;
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`;
}
