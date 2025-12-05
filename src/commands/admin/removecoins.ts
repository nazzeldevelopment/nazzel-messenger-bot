import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';

export const command: Command = {
  name: 'removecoins',
  aliases: ['takecoins', 'removebal', 'takemoney'],
  description: 'Remove coins from a user (Owner only)',
  category: 'admin',
  usage: 'removecoins <@mention|userID> <amount>',
  examples: ['removecoins @user 1000', 'removecoins 123456789 500'],
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
📌 N!removecoins <@user> <amount>
📌 N!removecoins <userID> <amount>
━━━━━━━━━━━━━━━
Example: N!removecoins @user 1000`);
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

    try {
      const userInfo = await api.getUserInfo(targetId);
      const userName = userInfo[targetId]?.name || 'Unknown';
      
      const currentCoins = await database.getUserCoins(targetId);

      const result = await database.removeCoins(targetId, amount, 'admin_remove', `Removed by owner`);
      
      if (!result.success) {
        await reply(`❌ INSUFFICIENT BALANCE
━━━━━━━━━━━━━━━
👤 ${userName}
💰 Current: ${currentCoins.toLocaleString()} coins
❌ Cannot remove ${amount.toLocaleString()} coins
━━━━━━━━━━━━━━━`);
        return;
      }

      await reply(`✅ COINS REMOVED
━━━━━━━━━━━━━━━
👤 ${userName}
💰 -${amount.toLocaleString()} coins
💵 New Balance: ${result.newBalance.toLocaleString()}
━━━━━━━━━━━━━━━`);
    } catch (error) {
      await reply(`❌ Failed to remove coins`);
    }
  },
};
