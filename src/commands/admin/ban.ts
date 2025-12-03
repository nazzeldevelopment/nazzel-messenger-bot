import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';

export const command: Command = {
  name: 'ban',
  aliases: ['block', 'blacklist'],
  description: 'Ban a user from using bot commands',
  category: 'admin',
  usage: 'ban <@mention or user ID> [reason]',
  examples: ['ban @user Spamming', 'ban 123456789 Breaking rules'],
  cooldown: 5,
  adminOnly: true,

  async execute({ api, event, args, reply }) {
    if (!args[0]) {
      await reply('❌ Please mention a user or provide their ID.\n\nUsage: ban <@mention or ID> [reason]');
      return;
    }

    let targetId = String(args[0].replace(/[^0-9]/g, ''));
    
    if (event.messageReply) {
      targetId = String(event.messageReply.senderID);
    } else if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = String(Object.keys(event.mentions)[0]);
    }

    if (!targetId) {
      await reply('❌ Could not find user to ban.');
      return;
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';
    const senderId = String(event.senderID);

    try {
      const userInfo = await new Promise<Record<string, any>>((resolve, reject) => {
        api.getUserInfo(targetId, (err: Error | null, info: any) => {
          if (err) reject(err);
          else resolve(info);
        });
      });

      const userName = userInfo[targetId]?.name || 'Unknown User';

      await database.setSetting(`banned_${targetId}`, JSON.stringify({
        bannedBy: senderId,
        reason,
        timestamp: new Date().toISOString(),
      }));

      await reply(`🔨 *User Banned*\n\n👤 User: ${userName}\n🆔 ID: ${targetId}\n📝 Reason: ${reason}\n\nThis user can no longer use bot commands.`);
    } catch (error) {
      await reply('❌ Failed to ban user.');
    }
  },
};
