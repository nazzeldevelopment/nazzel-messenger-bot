import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';

const command: Command = {
  name: 'announce',
  aliases: ['ann', 'notice'],
  description: 'Send a professional announcement message to the group',
  category: 'admin',
  usage: 'announce <message>',
  examples: ['announce Meeting at 5 PM today!', 'announce Important: Server maintenance tonight'],
  adminOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { event, args, reply, config, api } = context;
    
    if (args.length === 0) {
      await reply(`
╔══════════════════════════════════════════════════════════════╗
║                   ANNOUNCEMENT ERROR                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   Please provide a message to announce!                     ║
║                                                              ║
║   Usage: ${config.bot.prefix}announce <message>                        ║
║                                                              ║
║   Example:                                                   ║
║   ${config.bot.prefix}announce Meeting at 5 PM today!                  ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`);
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
      const threadInfo = await api.getThreadInfo(String(event.threadID));
      groupName = threadInfo.threadName || 'This Group';
    } catch (e) {}
    
    const announcement = `
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║    █████╗ ███╗   ██╗███╗   ██╗ ██████╗ ██╗   ██╗███╗   ██╗ ██████╗███████╗   ║
║   ██╔══██╗████╗  ██║████╗  ██║██╔═══██╗██║   ██║████╗  ██║██╔════╝██╔════╝   ║
║   ███████║██╔██╗ ██║██╔██╗ ██║██║   ██║██║   ██║██╔██╗ ██║██║     █████╗     ║
║   ██╔══██║██║╚██╗██║██║╚██╗██║██║   ██║██║   ██║██║╚██╗██║██║     ██╔══╝     ║
║   ██║  ██║██║ ╚████║██║ ╚████║╚██████╔╝╚██████╔╝██║ ╚████║╚██████╗███████╗   ║
║   ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝╚══════╝   ║
║                                                              ║
║                  OFFICIAL GROUP ANNOUNCEMENT                ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   ──────────────────────────────────────────────────────    ║
║                                                              ║
║   ${message}
║                                                              ║
║   ──────────────────────────────────────────────────────    ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   GROUP    : ${groupName.substring(0, 40)}
║   DATE     : ${timestamp}
║   FROM     : Group Admin
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   Please read carefully and follow any instructions         ║
║   mentioned in this announcement.                           ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`;
    
    try {
      await reply(announcement);
      BotLogger.info(`Announcement sent to ${event.threadID}`, { message });
    } catch (error) {
      BotLogger.error('Failed to send announcement', error);
      await reply(`
╔══════════════════════════════════════════════════════════════╗
║                   ANNOUNCEMENT FAILED                       ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   Failed to send announcement.                              ║
║   Please try again later.                                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`);
    }
  }
};

export default command;
