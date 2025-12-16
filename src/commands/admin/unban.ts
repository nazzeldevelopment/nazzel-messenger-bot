import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';
import { safeGetUserInfo } from '../../lib/apiHelpers.js';

export const command: Command = {
  name: 'unban',
  aliases: ['unblock', 'whitelist'],
  description: 'Unban a user from bot commands',
  category: 'admin',
  usage: 'unban <user ID>',
  examples: ['unban 123456789'],
  cooldown: 5,
  adminOnly: true,

  async execute({ api, args, reply }) {
    if (!args[0]) {
      await reply('❌ Please provide a user ID.\n\nUsage: unban <user ID>');
      return;
    }

    const targetId = String(args[0].replace(/[^0-9]/g, ''));

    if (!targetId) {
      await reply('❌ Invalid user ID.');
      return;
    }

    try {
      const banData = await database.getSetting(`banned_${targetId}`);
      
      if (!banData) {
        await reply('ℹ️ This user is not banned.');
        return;
      }

      const userInfo = await safeGetUserInfo(api, targetId);
      const userName = userInfo[targetId]?.name || 'Unknown User';

      await database.deleteSetting(`banned_${targetId}`);

      await reply(`✅ *User Unbanned*\n\n👤 User: ${userName}\n🆔 ID: ${targetId}\n\nThis user can now use bot commands again.`);
    } catch (error) {
      await reply('❌ Failed to unban user.');
    }
  },
};
