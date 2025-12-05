import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';

export const command: Command = {
  name: 'balance',
  aliases: ['bal', 'coins', 'wallet', 'money'],
  description: 'Check your coin balance and stats',
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
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ❌ 𝗘𝗥𝗥𝗢𝗥 ❌     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ Could not fetch user data.
Please try again later.`);
        return;
      }

      const coins = user.coins ?? 0;
      const streak = user.dailyStreak ?? 0;
      const level = user.level ?? 0;
      const xp = user.xp ?? 0;
      const xpNeeded = (level + 1) * 100;
      const xpProgress = Math.round((xp / xpNeeded) * 100);
      const totalMsgs = user.totalMessages ?? 0;

      const rankEmoji = coins >= 100000 ? '👑' : 
                        coins >= 50000 ? '💎' :
                        coins >= 10000 ? '💰' : 
                        coins >= 5000 ? '💵' : 
                        coins >= 1000 ? '🪙' : '💸';
      
      const rankTitle = coins >= 100000 ? 'Legendary' : 
                        coins >= 50000 ? 'Diamond' :
                        coins >= 10000 ? 'Gold' : 
                        coins >= 5000 ? 'Silver' : 
                        coins >= 1000 ? 'Bronze' : 'Starter';

      const shortName = userName.length > 18 ? userName.substring(0, 15) + '...' : userName;
      const levelStars = '⭐'.repeat(Math.min(level, 5)) || '✧';
      const streakBonus = Math.min(streak * 10, 100);

      if (isSelf) {
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ${rankEmoji} 𝗠𝗬 𝗪𝗔𝗟𝗟𝗘𝗧 ${rankEmoji}     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌── 💰 𝗕𝗮𝗹𝗮𝗻𝗰𝗲 ──┐
│ 🪙 ${coins.toLocaleString()} coins
│ 🏅 Rank: ${rankTitle}
└────────────────────┘

┌── 📊 𝗦𝘁𝗮𝘁𝘀 ──┐
│ 🏆 Level ${level} ${levelStars}
│ ✨ XP: ${xp}/${xpNeeded} (${xpProgress}%)
│ 🔥 Streak: ${streak}x (+${streakBonus} bonus)
│ 💬 Messages: ${totalMsgs.toLocaleString()}
└────────────────────┘

┌── 💎 𝗘𝗮𝗿𝗻 𝗠𝗼𝗿𝗲 ──┐
│ ${prefix}claim   ➜ Daily reward
│ ${prefix}work    ➜ Earn coins
│ ${prefix}slots   ➜ Try your luck
│ ${prefix}gamble  ➜ Risk it all
│ ${prefix}rob     ➜ Steal coins
└─────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ${prefix}richest ➜ View leaderboard`);
      } else {
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ${rankEmoji} 𝗕𝗔𝗟𝗔𝗡𝗖𝗘 ${rankEmoji}     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌─────────────────────────────┐
│ 👤 ${shortName}
└─────────────────────────────┘

┌── 💰 𝗪𝗮𝗹𝗹𝗲𝘁 ──┐
│ 🪙 ${coins.toLocaleString()} coins
│ 🏅 Rank: ${rankTitle}
└────────────────────┘

┌── 📊 𝗦𝘁𝗮𝘁𝘀 ──┐
│ 🏆 Level ${level} ${levelStars}
│ 🔥 Streak: ${streak}x
│ 💬 Messages: ${totalMsgs.toLocaleString()}
└────────────────────┘`);
      }
    } catch (error) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ❌ 𝗘𝗥𝗥𝗢𝗥 ❌     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ Failed to get balance.
Please try again later.`);
    }
  },
};
