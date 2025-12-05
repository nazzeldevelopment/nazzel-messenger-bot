import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';

export const command: Command = {
  name: 'balance',
  aliases: ['bal', 'coins', 'wallet', 'money'],
  description: 'Check your coin balance',
  category: 'economy',
  usage: 'balance [@mention]',
  examples: ['balance', 'bal', 'coins @user'],
  cooldown: 3000,

  async execute({ api, event, args, reply, prefix }) {
    let targetId = ('' + event.senderID).trim();
    let isSelf = true;
    
    if (event.messageReply) {
      targetId = ('' + event.messageReply.senderID).trim();
      isSelf = targetId === ('' + event.senderID).trim();
    } else if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = ('' + Object.keys(event.mentions)[0]).trim();
      isSelf = targetId === ('' + event.senderID).trim();
    } else if (args[0]) {
      const parsed = args[0].replace(/[^0-9]/g, '');
      if (parsed) {
        targetId = ('' + parsed).trim();
        isSelf = targetId === ('' + event.senderID).trim();
      }
    }

    try {
      const userInfo = await api.getUserInfo(targetId);
      const userName = userInfo[targetId]?.name || 'Unknown';
      const user = await database.getOrCreateUser(targetId, userName);
      
      if (!user) {
        await reply(`❌ Could not fetch user data`);
        return;
      }

      const coins = user.coins ?? 0;
      const streak = user.dailyStreak ?? 0;
      const level = user.level ?? 0;

      const coinEmoji = coins >= 10000 ? '💰' : coins >= 1000 ? '💵' : coins >= 100 ? '🪙' : '💸';
      const shortName = userName.length > 15 ? userName.substring(0, 12) + '...' : userName;

      if (isSelf) {
        await reply(`╭───────────────────╮
│  ${coinEmoji} MY WALLET     │
╰───────────────────╯
💰 ${coins.toLocaleString()} coins
🔥 ${streak}x streak
🏆 Level ${level}

╭─ Earn More ─╮
│ ${prefix}claim  │
│ ${prefix}slots  │
│ ${prefix}gamble │
╰─────────────╯`);
      } else {
        await reply(`╭───────────────────╮
│  ${coinEmoji} BALANCE      │
╰───────────────────╯
👤 ${shortName}
💰 ${coins.toLocaleString()} coins
🔥 ${streak}x streak
🏆 Level ${level}`);
      }
    } catch (error) {
      await reply(`❌ Failed to get balance`);
    }
  },
};
