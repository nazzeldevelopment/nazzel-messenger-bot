import type { Command, CommandContext } from '../../types/index.js';
import { safeGetThreadInfo } from '../../lib/apiHelpers.js';
import { BotLogger } from '../../lib/logger.js';
import { decorations } from '../../lib/messageFormatter.js';

const command: Command = {
  name: 'announce',
  aliases: ['ann', 'notice'],
  description: 'Send a professional announcement to the group',
  category: 'admin',
  usage: 'announce <message>',
  examples: ['announce Meeting at 5 PM today!', 'announce Important: Server maintenance tonight'],
  adminOnly: true,
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { event, args, reply, prefix, api } = context;
    
    if (args.length === 0) {
      await reply(`📢 『 ANNOUNCEMENT 』 📢
═══════════════════════════
${decorations.sparkle} Send group announcements
═══════════════════════════

◈ USAGE
═══════════════════════════
➤ ${prefix}announce <message>

◈ EXAMPLE
═══════════════════════════
➤ ${prefix}announce Meeting at 5 PM!`);
      return;
    }
    
    const message = args.join(' ');
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Manila',
      dateStyle: 'full',
      timeStyle: 'short'
    });
    
    let groupName = 'This Group';
    try {
      const threadInfo = await safeGetThreadInfo(api, String(event.threadID));
      groupName = threadInfo.threadName || 'This Group';
    } catch (e) {}
    
    const announcement = `📢 『 ANNOUNCEMENT 』 📢
═══════════════════════════
${decorations.fire} Official Notice
═══════════════════════════

${message}

═══════════════════════════
📍 Group: ${groupName.substring(0, 25)}${groupName.length > 25 ? '...' : ''}
📅 Date: ${timestamp}
👤 From: Group Admin
═══════════════════════════
${decorations.sparkle} Please read carefully!`;
    
    try {
      await reply(announcement);
      BotLogger.info(`Announcement sent to ${event.threadID}`, { message });
    } catch (error) {
      BotLogger.error('Failed to send announcement', error);
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Failed to send announcement`);
    }
  }
};

export default command;
