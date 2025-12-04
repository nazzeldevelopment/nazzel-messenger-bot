import type { Command, CommandContext } from '../../types/index.js';
import config from '../../../config.json' with { type: 'json' };
import { database } from '../../database/index.js';

const command: Command = {
  name: 'prefix',
  aliases: ['px', 'setprefix', 'changeprefix'],
  description: 'Show or change the bot prefix (owner/admin only can change)',
  category: 'utility',
  usage: 'prefix [new_prefix]',
  examples: ['prefix', 'prefix !', 'prefix ?'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, event, api } = context;
    
    const threadId = String(event.threadID);
    const senderId = String(event.senderID);
    const ownerId = process.env.OWNER_ID;
    
    const currentPrefix = await database.getSetting<string>(`prefix_${threadId}`) || config.bot.prefix;
    
    if (args.length === 0) {
      await reply(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ██████╗ ██████╗ ███████╗███████╗██╗██╗  ██╗                ║
║   ██╔══██╗██╔══██╗██╔════╝██╔════╝██║╚██╗██╔╝                ║
║   ██████╔╝██████╔╝█████╗  █████╗  ██║ ╚███╔╝                 ║
║   ██╔═══╝ ██╔══██╗██╔══╝  ██╔══╝  ██║ ██╔██╗                 ║
║   ██║     ██║  ██║███████╗██║     ██║██╔╝ ██╗                ║
║   ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝                ║
║                                                              ║
║                   PREFIX INFORMATION                        ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   Current Prefix: [ ${currentPrefix} ]                                   ║
║                                                              ║
║   Example Usage:                                            ║
║   ${currentPrefix}help     - View all commands                         ║
║   ${currentPrefix}ping     - Check bot latency                         ║
║   ${currentPrefix}info     - Bot information                           ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   To change prefix (Owner/Admin only):                      ║
║   ${currentPrefix}prefix <new_prefix>                                  ║
║                                                              ║
║   Example: ${currentPrefix}prefix !                                    ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`);
      return;
    }
    
    const isOwner = ownerId && senderId === ownerId;
    
    let isAdmin = false;
    try {
      const threadInfo = await api.getThreadInfo(threadId);
      const adminIds = threadInfo.adminIDs?.map((a: any) => String(a.id)) || [];
      isAdmin = adminIds.includes(senderId);
    } catch (e) {}
    
    if (!isOwner && !isAdmin) {
      await reply(`
╔══════════════════════════════════════════════════════════════╗
║                    ACCESS DENIED                            ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   Only the bot owner or group admins can change             ║
║   the prefix.                                               ║
║                                                              ║
║   Current Prefix: [ ${currentPrefix} ]                                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`);
      return;
    }
    
    const newPrefix = args[0];
    
    if (newPrefix.length > 5) {
      await reply(`
╔══════════════════════════════════════════════════════════════╗
║                    INVALID PREFIX                           ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   Prefix must be 5 characters or less.                      ║
║                                                              ║
║   Example valid prefixes:                                   ║
║   ! ? # $ % ^ & * - _ . / \\                                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`);
      return;
    }
    
    await database.setSetting(`prefix_${threadId}`, newPrefix);
    
    await reply(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ██████╗ ██████╗ ███████╗███████╗██╗██╗  ██╗                ║
║   ██╔══██╗██╔══██╗██╔════╝██╔════╝██║╚██╗██╔╝                ║
║   ██████╔╝██████╔╝█████╗  █████╗  ██║ ╚███╔╝                 ║
║   ██╔═══╝ ██╔══██╗██╔══╝  ██╔══╝  ██║ ██╔██╗                 ║
║   ██║     ██║  ██║███████╗██║     ██║██╔╝ ██╗                ║
║   ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝                ║
║                                                              ║
║                   PREFIX CHANGED                            ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   Old Prefix: [ ${currentPrefix} ]                                       ║
║   New Prefix: [ ${newPrefix} ]                                       ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   Now use commands with the new prefix:                     ║
║   ${newPrefix}help     - View all commands                         ║
║   ${newPrefix}ping     - Check bot latency                         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`);
  }
};

export default command;
