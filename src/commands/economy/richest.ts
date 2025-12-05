import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';

export const command: Command = {
  name: 'richest',
  aliases: ['richleaderboard', 'coinsleaderboard', 'topmoney', 'topcoins'],
  description: 'View the richest users',
  category: 'economy',
  usage: 'richest [limit]',
  examples: ['richest', 'richest 20'],
  cooldown: 10000,

  async execute({ api, event, args, reply }) {
    const limit = Math.min(parseInt(args[0], 10) || 10, 20);

    try {
      const leaderboard = await database.getCoinsLeaderboard(limit);
      
      if (leaderboard.length === 0) {
        await reply(`💰 RICHEST
━━━━━━━━━━━━━━━
❌ No users with coins yet!
📌 Use N!claim to get started
━━━━━━━━━━━━━━━`);
        return;
      }

      const userIds = leaderboard.map(u => u.id);
      let userNames: Record<string, string> = {};
      
      try {
        const userInfo = await api.getUserInfo(userIds);
        for (const id of userIds) {
          userNames[id] = userInfo[id]?.name || 'Unknown';
        }
      } catch {
        for (const id of userIds) {
          userNames[id] = 'Unknown';
        }
      }

      let list = '';
      for (let i = 0; i < leaderboard.length; i++) {
        const user = leaderboard[i];
        const name = userNames[user.id] || user.name || 'Unknown';
        const shortName = name.length > 15 ? name.substring(0, 12) + '...' : name;
        
        let rankEmoji = '';
        if (i === 0) rankEmoji = '🥇';
        else if (i === 1) rankEmoji = '🥈';
        else if (i === 2) rankEmoji = '🥉';
        else rankEmoji = `${i + 1}.`;
        
        list += `${rankEmoji} ${shortName}: ${(user.coins ?? 0).toLocaleString()}\n`;
      }

      await reply(`💰 RICHEST USERS
━━━━━━━━━━━━━━━
${list.trim()}
━━━━━━━━━━━━━━━
📌 N!claim - Daily coins
📌 N!slots - Try your luck`);
    } catch (error) {
      await reply(`❌ Failed to get leaderboard`);
    }
  },
};
