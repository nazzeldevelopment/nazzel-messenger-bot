import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';

export const command: Command = {
  name: 'claim',
  aliases: ['daily', 'reward', 'collect'],
  description: 'Claim your daily coins reward',
  category: 'economy',
  usage: 'claim',
  examples: ['claim', 'daily'],
  cooldown: 5000,

  async execute({ api, event, reply, prefix }) {
    const userId = ('' + event.senderID).trim();

    try {
      const userInfo = await api.getUserInfo(userId);
      const userName = userInfo[userId]?.name || 'User';
      const shortName = userName.length > 15 ? userName.substring(0, 12) + '...' : userName;

      const result = await database.claimDaily(userId);
      
      if (!result.success) {
        const nextClaimTime = result.nextClaim 
          ? result.nextClaim.toLocaleString('en-PH', { 
              timeZone: 'Asia/Manila',
              hour: 'numeric',
              minute: '2-digit',
              hour12: true
            })
          : 'soon';

        const hoursRemaining = result.nextClaim 
          ? Math.ceil((result.nextClaim.getTime() - Date.now()) / (1000 * 60 * 60))
          : 0;

        await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ⏰ 𝗔𝗟𝗥𝗘𝗔𝗗𝗬 𝗖𝗟𝗔𝗜𝗠𝗘𝗗 ⏰     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌─────────────────────────────┐
│ ❌ ${result.message}
│ 🔥 Current Streak: ${result.streak}x
└─────────────────────────────┘

┌── ⏱️ 𝗡𝗲𝘅𝘁 𝗖𝗹𝗮𝗶𝗺 ──┐
│ 📅 ${nextClaimTime}
│ ⏳ ~${hoursRemaining} hours remaining
└─────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Don't break your streak!`);
        return;
      }

      const streakEmoji = result.streak >= 14 ? '👑' : 
                          result.streak >= 7 ? '🌟' : 
                          result.streak >= 3 ? '🔥' : '✨';
      const user = await database.getOrCreateUser(userId);
      const newBalance = user?.coins ?? result.coins;
      
      const baseReward = 100;
      const streakBonus = Math.min(result.streak * 10, 100);
      
      const milestoneMsg = result.streak === 7 ? '\n🎊 7-Day Streak Milestone!' :
                           result.streak === 14 ? '\n👑 14-Day Streak Milestone!' :
                           result.streak === 30 ? '\n💎 30-Day Streak Milestone!' : '';

      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🎁 𝗗𝗔𝗜𝗟𝗬 𝗖𝗟𝗔𝗜𝗠𝗘𝗗 🎁     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌── 💰 𝗥𝗲𝘄𝗮𝗿𝗱𝘀 ──┐
│ 🪙 Base: +${baseReward} coins
│ 🔥 Streak Bonus: +${streakBonus} coins
│ 💵 Total: +${result.coins} coins
└────────────────────────────┘

┌── 📊 𝗦𝘁𝗮𝘁𝘀 ──┐
│ ${streakEmoji} Streak: ${result.streak} days
│ 🏦 Balance: ${newBalance.toLocaleString()} coins
└────────────────────────────┘${milestoneMsg}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ Next claim in 24 hours
💡 Keep your streak for bigger bonuses!`);
    } catch (error) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ❌ 𝗘𝗥𝗥𝗢𝗥 ❌     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ Failed to claim reward.
Please try again later.`);
    }
  },
};
