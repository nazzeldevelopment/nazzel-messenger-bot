import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';

export const command: Command = {
  name: 'deleteacc',
  aliases: ['deleteaccount', 'removeuser', 'deluser'],
  description: 'Delete a user account from the database (Owner only)',
  category: 'admin',
  usage: 'deleteacc <@mention|userID> [confirm]',
  examples: ['deleteacc @user', 'deleteacc 123456789 confirm'],
  cooldown: 10000,
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

    if (args.length < 1) {
      await reply(`❌ USAGE ERROR
━━━━━━━━━━━━━━━
📌 N!deleteacc <@user>
📌 N!deleteacc <userID> confirm
━━━━━━━━━━━━━━━
⚠️ This action is irreversible!`);
      return;
    }

    let targetId = '';

    if (event.messageReply) {
      targetId = ('' + event.messageReply.senderID).trim();
    } else if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = ('' + Object.keys(event.mentions)[0]).trim();
    } else {
      const parsed = args[0].replace(/[^0-9]/g, '');
      targetId = parsed ? ('' + parsed).trim() : '';
    }

    if (!targetId) {
      await reply(`❌ Invalid user ID`);
      return;
    }

    if (targetId === ownerId) {
      await reply(`❌ Cannot delete owner account`);
      return;
    }

    try {
      const userInfo = await api.getUserInfo(targetId);
      const userName = userInfo[targetId]?.name || 'Unknown';
      const user = await database.getUser(targetId);
      
      if (!user) {
        await reply(`❌ USER NOT FOUND
━━━━━━━━━━━━━━━
👤 ${userName}
❌ No account in database
━━━━━━━━━━━━━━━`);
        return;
      }

      const hasConfirm = args.includes('confirm') || args.includes('yes');

      if (!hasConfirm) {
        await reply(`⚠️ CONFIRM DELETION
━━━━━━━━━━━━━━━
👤 ${userName}
💰 ${(user.coins ?? 0).toLocaleString()} coins
🏆 Level ${user.level}
━━━━━━━━━━━━━━━
⚠️ This will delete ALL user data!
📌 Reply: N!deleteacc ${targetId} confirm`);
        return;
      }

      const success = await database.deleteUserAccount(targetId);
      
      if (!success) {
        await reply(`❌ Failed to delete account`);
        return;
      }

      await reply(`✅ ACCOUNT DELETED
━━━━━━━━━━━━━━━
👤 ${userName}
🗑️ Account removed
💰 ${(user.coins ?? 0).toLocaleString()} coins lost
🏆 Level ${user.level} lost
━━━━━━━━━━━━━━━`);
    } catch (error) {
      await reply(`❌ Failed to delete account`);
    }
  },
};
