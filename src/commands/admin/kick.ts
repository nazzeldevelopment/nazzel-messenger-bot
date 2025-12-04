import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';

const command: Command = {
  name: 'kick',
  aliases: ['remove', 'boot'],
  description: 'Remove a member from the group',
  category: 'admin',
  usage: 'kick <@mention|userID>',
  examples: ['kick @user', 'kick 123456789'],
  adminOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, args, reply, config } = context;
    
    let targetId: string | null = null;
    
    if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = ('' + Object.keys(event.mentions)[0]).trim();
    } else if (args[0] && /^\d+$/.test(args[0])) {
      targetId = ('' + args[0]).trim();
    }
    
    if (!targetId) {
      await reply(`
╔══════════════════════════════════════════════════════════════╗
║                      KICK ERROR                             ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   Please mention a user or provide a user ID to kick.       ║
║                                                              ║
║   Usage: ${config.bot.prefix}kick <@mention|userID>                    ║
║                                                              ║
║   Examples:                                                  ║
║   ${config.bot.prefix}kick @username                                   ║
║   ${config.bot.prefix}kick 123456789                                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`);
      return;
    }
    
    if (targetId === ('' + event.senderID).trim()) {
      await reply(`
╔══════════════════════════════════════════════════════════════╗
║                      KICK DENIED                            ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   You cannot kick yourself from the group!                  ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`);
      return;
    }
    
    try {
      const userInfo = await api.getUserInfo(targetId);
      const userName = userInfo[targetId]?.name || 'Unknown';
      
      const threadId = ('' + event.threadID).trim();
      await api.removeUserFromGroup(targetId, threadId);
      
      const timestamp = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      
      BotLogger.info(`Kicked user ${targetId} (${userName}) from group ${threadId}`);
      
      await reply(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ██╗  ██╗██╗ ██████╗██╗  ██╗███████╗██████╗                 ║
║   ██║ ██╔╝██║██╔════╝██║ ██╔╝██╔════╝██╔══██╗                ║
║   █████╔╝ ██║██║     █████╔╝ █████╗  ██║  ██║                ║
║   ██╔═██╗ ██║██║     ██╔═██╗ ██╔══╝  ██║  ██║                ║
║   ██║  ██╗██║╚██████╗██║  ██╗███████╗██████╔╝                ║
║   ╚═╝  ╚═╝╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═════╝                 ║
║                                                              ║
║                  USER REMOVED FROM GROUP                    ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   REMOVED USER                                              ║
║   ─────────────────────────────────────                     ║
║   Name     : ${userName}
║   ID       : ${targetId}
║   Time     : ${timestamp}
║   Status   : ✅ Successfully Removed                        ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   The user has been removed from this group chat.           ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`);
    } catch (error) {
      BotLogger.error(`Failed to kick user ${targetId}`, error);
      await reply(`
╔══════════════════════════════════════════════════════════════╗
║                      KICK FAILED                            ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   Failed to remove user from the group.                     ║
║                                                              ║
║   Possible reasons:                                         ║
║   - Bot doesn't have admin permissions                      ║
║   - User is already removed                                 ║
║   - User is a group admin                                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`);
    }
  }
};

export default command;
