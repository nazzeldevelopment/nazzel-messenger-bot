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
      const shortName = userName.length > 12 ? userName.substring(0, 10) + '...' : userName;

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

        await reply(`╭───────────────────╮
│   ⏰ COOLDOWN    │
╰───────────────────╯
❌ ${result.message}
🔥 Streak: ${result.streak}x
⏰ Next: ${nextClaimTime}`);
        return;
      }

      const streakEmoji = result.streak >= 7 ? '🌟' : result.streak >= 3 ? '🔥' : '✨';
      const user = await database.getOrCreateUser(userId);
      const newBalance = user?.coins ?? result.coins;

      await reply(`╭───────────────────╮
│   🎁 CLAIMED!    │
╰───────────────────╯
👤 ${shortName}

💰 +${result.coins} coins
${streakEmoji} Streak: ${result.streak}x
💵 Total: ${newBalance.toLocaleString()}

📌 Claim again in 24hrs
💡 Keep streak for bonus!`);
    } catch (error) {
      await reply(`❌ Failed to claim reward`);
    }
  },
};
