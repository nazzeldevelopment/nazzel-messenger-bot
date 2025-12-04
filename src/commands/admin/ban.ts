import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';
import { decorations } from '../../lib/messageFormatter.js';

export const command: Command = {
  name: 'ban',
  aliases: ['block', 'blacklist'],
  description: 'Ban a user from using bot commands',
  category: 'admin',
  usage: 'ban <@mention or user ID> [reason]',
  examples: ['ban @user Spamming', 'ban 123456789 Breaking rules'],
  cooldown: 5000,
  adminOnly: true,

  async execute({ api, event, args, reply, prefix }) {
    if (!args[0]) {
      await reply(`🔨 『 BAN USER 』 🔨
═══════════════════════════
${decorations.fire} Ban a user from the bot
═══════════════════════════

◈ USAGE
═══════════════════════════
➤ ${prefix}ban @user [reason]
➤ ${prefix}ban <ID> [reason]

◈ EXAMPLE
═══════════════════════════
➤ ${prefix}ban @user Spamming`);
      return;
    }

    let targetId = String(args[0].replace(/[^0-9]/g, ''));
    
    if (event.messageReply) {
      targetId = String(event.messageReply.senderID);
    } else if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = String(Object.keys(event.mentions)[0]);
    }

    if (!targetId) {
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Could not find user to ban`);
      return;
    }

    const reason = args.slice(1).join(' ') || 'No reason provided';
    const senderId = String(event.senderID);
    
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Manila',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    try {
      const userInfo = await api.getUserInfo(targetId);
      const userName = userInfo[targetId]?.name || 'Unknown User';

      await database.setSetting(`banned_${targetId}`, JSON.stringify({
        bannedBy: senderId,
        reason,
        timestamp: new Date().toISOString(),
      }));

      await reply(`🔨 『 USER BANNED 』 🔨
═══════════════════════════
${decorations.fire} Ban Executed
═══════════════════════════

◈ BANNED USER
═══════════════════════════
👤 Name: ${userName}
🆔 ID: ${targetId}
📝 Reason: ${reason}
⏰ Banned: ${timestamp}
🚫 Status: BANNED

═══════════════════════════
💡 Use ${prefix}unban <ID> to remove
═══════════════════════════
${decorations.sparkle} User can no longer use bot`);
    } catch (error) {
      await reply(`${decorations.fire} 『 BAN FAILED 』
═══════════════════════════
❌ Failed to ban user
💡 Please try again later`);
    }
  },
};

export default command;
