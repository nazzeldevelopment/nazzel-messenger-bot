import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';

const command: Command = {
  name: 'announce',
  aliases: ['ann', 'broadcast'],
  description: 'Send an announcement message to the group',
  category: 'admin',
  usage: 'announce <message>',
  examples: ['announce Meeting at 5 PM today!', 'announce Important: Server maintenance tonight'],
  adminOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, args, reply } = context;
    
    if (args.length === 0) {
      await reply('❌ Please provide an announcement message.\nUsage: announce <message>');
      return;
    }
    
    const message = args.join(' ');
    
    const announcement = `╔═══════════════════════════════╗
║ 📢 ANNOUNCEMENT
╠═══════════════════════════════╣
║ 
║ ${message}
║ 
╠═══════════════════════════════╣
║ 📅 ${new Date().toLocaleString()}
╚═══════════════════════════════╝`;
    
    try {
      await new Promise<void>((resolve, reject) => {
        api.sendMessage(announcement, event.threadID, (err: Error | null) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      BotLogger.info(`Announcement sent to ${event.threadID}`, { message });
    } catch (error) {
      BotLogger.error('Failed to send announcement', error);
      await reply('❌ Failed to send announcement.');
    }
  }
};

export default command;
