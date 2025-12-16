import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';
import { safeGetUserInfo } from '../../lib/apiHelpers.js';

export const command: Command = {
  name: 'richest',
  aliases: ['richleaderboard', 'coinsleaderboard', 'topmoney', 'topcoins'],
  description: 'View the richest users',
  category: 'economy',
  usage: 'richest [limit]',
  examples: ['richest', 'richest 20'],
  cooldown: 10000,

  async execute({ api, event, args, reply, prefix }) {
    const limit = Math.min(parseInt(args[0], 10) || 10, 20);

    try {
      const leaderboard = await database.getCoinsLeaderboard(limit);
      
      if (leaderboard.length === 0) {
        await reply(`╭───────────────────╮
│   💰 RICHEST     │
╰───────────────────╯
❌ No users with coins yet!
📌 Use ${prefix}claim to start`);
        return;
      }

      const userIds = leaderboard.map(u => u.id);
      let userNames: Record<string, string> = {};
      
      const userInfo = await safeGetUserInfo(api, userIds);
      for (const id of userIds) {
        userNames[id] = userInfo[id]?.name || 'Unknown';
      }

      let list = '';
      for (let i = 0; i < leaderboard.length; i++) {
        const user = leaderboard[i];
        const name = userNames[user.id] || user.name || 'Unknown';
        const shortName = name.length > 12 ? name.substring(0, 10) + '..' : name;
        
        let rankEmoji = '';
        if (i === 0) rankEmoji = '🥇';
        else if (i === 1) rankEmoji = '🥈';
        else if (i === 2) rankEmoji = '🥉';
        else rankEmoji = `${i + 1}.`;
        
        list += `${rankEmoji} ${shortName}: ${(user.coins ?? 0).toLocaleString()}\n`;
      }

      await reply(`╭───────────────────╮
│   💰 RICHEST     │
╰───────────────────╯
${list.trim()}

📌 ${prefix}claim - Daily coins`);
    } catch (error) {
      await reply(`❌ Failed to get leaderboard`);
    }
  },
};
