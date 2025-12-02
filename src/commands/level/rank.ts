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
    let targetId = event.senderID;
    
    if (event.messageReply) {
      targetId = event.messageReply.senderID;
    } else if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = Object.keys(event.mentions)[0];
    } else if (args[0]) {
      targetId = args[0].replace(/[^0-9]/g, '') || event.senderID;
    }

    try {
      const userInfo = await new Promise<Record<string, any>>((resolve, reject) => {
        api.getUserInfo(targetId, (err: Error | null, info: any) => {
          if (err) reject(err);
          else resolve(info);
        });
      });

      const userName = userInfo[targetId]?.name || 'Unknown User';
      
      const leaderboard = await database.getLeaderboard(100);
      const userIndex = leaderboard.findIndex(u => u.id === targetId);
      const user = await database.getUser(targetId);

      if (!user) {
        await reply(`ℹ️ ${userName} hasn't earned any XP yet. Start chatting to gain XP!`);
        return;
      }

      const rank = userIndex >= 0 ? userIndex + 1 : 'Unranked';
      const totalUsers = await database.getTotalUsers();
      const xpForNextLevel = (user.level + 1) * 100;
      const progress = Math.round((user.xp / xpForNextLevel) * 100);

      let rankEmoji = '📊';
      if (rank === 1) rankEmoji = '🥇';
      else if (rank === 2) rankEmoji = '🥈';
      else if (rank === 3) rankEmoji = '🥉';
      else if (typeof rank === 'number' && rank <= 10) rankEmoji = '🏅';

      let message = `${rankEmoji} *Rank Card*\n\n`;
      message += `👤 Name: ${userName}\n`;
      message += `🏆 Rank: #${rank} / ${totalUsers}\n`;
      message += `🎖️ Level: ${user.level}\n`;
      message += `⭐ XP: ${user.xp} / ${xpForNextLevel}\n`;
      message += `📈 Progress: ${progress}%\n`;
      message += `💬 Messages: ${user.totalMessages}`;

      await reply(message);
    } catch (error) {
      await reply('❌ Failed to get rank information.');
    }
  },
};
