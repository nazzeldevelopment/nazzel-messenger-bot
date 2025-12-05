import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';

export const command: Command = {
  name: 'addcoins',
  aliases: ['givecoins', 'addbal', 'givemoney'],
  description: 'Add coins to a user (Owner only)',
  category: 'admin',
  usage: 'addcoins <@mention|userID> <amount>',
  examples: ['addcoins @user 1000', 'addcoins 123456789 500'],
  cooldown: 5000,
  ownerOnly: true,

  async execute({ api, event, args, reply }) {
    const ownerId = process.env.OWNER_ID;
    const senderId = ('' + event.senderID).trim();
    
    if (!ownerId || senderId !== ownerId) {
      await reply(`❌ ACCESS DENIED
━━━━━━━━━━━━━━━
🔒 Owner only command`);
      return;
    }

    if (args.length < 2) {
      await reply(`❌ USAGE ERROR
━━━━━━━━━━━━━━━
📌 N!addcoins <@user> <amount>
📌 N!addcoins <userID> <amount>
━━━━━━━━━━━━━━━
Example: N!addcoins @user 1000`);
      return;
    }

    let targetId = '';
    let amount = 0;

    if (event.messageReply) {
      targetId = ('' + event.messageReply.senderID).trim();
      amount = parseInt(args[0], 10);
    } else if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = ('' + Object.keys(event.mentions)[0]).trim();
      amount = parseInt(args[args.length - 1], 10);
    } else {
      const parsed = args[0].replace(/[^0-9]/g, '');
      targetId = parsed ? ('' + parsed).trim() : '';
      amount = parseInt(args[1], 10);
    }

    if (!targetId) {
      await reply(`❌ Invalid user ID`);
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      await reply(`❌ Invalid amount. Must be a positive number`);
      return;
    }

    if (amount > 1000000) {
      await reply(`❌ Maximum 1,000,000 coins per transaction`);
      return;
    }

    try {
      const userInfo = await api.getUserInfo(targetId);
      const userName = userInfo[targetId]?.name || 'Unknown';

      const result = await database.addCoins(targetId, amount, 'admin_add', `Added by owner`);
      
      if (!result.success) {
        await reply(`❌ Failed to add coins`);
        return;
      }

      await reply(`✅ COINS ADDED
━━━━━━━━━━━━━━━
👤 ${userName}
💰 +${amount.toLocaleString()} coins
💵 New Balance: ${result.newBalance.toLocaleString()}
━━━━━━━━━━━━━━━`);
    } catch (error) {
      await reply(`❌ Failed to add coins`);
    }
  },
};
