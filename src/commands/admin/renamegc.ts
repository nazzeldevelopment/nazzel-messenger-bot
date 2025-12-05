import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { decorations } from '../../lib/messageFormatter.js';

const command: Command = {
  name: 'renamegc',
  aliases: ['rename', 'setgcname', 'groupname'],
  description: 'Rename the group chat',
  category: 'admin',
  usage: 'renamegc <new name>',
  examples: ['renamegc Gaming Squad', 'renamegc Study Group 2025'],
  adminOnly: true,
  cooldown: 15000,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, args, reply, prefix } = context;
    
    if (args.length === 0) {
      await reply(`✏️ 『 RENAME GROUP 』 ✏️
═══════════════════════════
${decorations.fire} Change group name
═══════════════════════════

◈ USAGE
═══════════════════════════
➤ ${prefix}renamegc <new name>

◈ EXAMPLE
═══════════════════════════
➤ ${prefix}renamegc Gaming Squad`);
      return;
    }
    
    const newName = args.join(' ');
    
    if (newName.length > 100) {
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Name too long!
💡 Max 100 characters allowed`);
      return;
    }
    
    try {
      const threadInfo = await api.getThreadInfo(String(event.threadID));
      const oldName = threadInfo.threadName || 'Unnamed Group';
      
      await api.setTitle(newName, String(event.threadID));
      
      const timestamp = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      
      BotLogger.info(`Renamed group ${event.threadID} from "${oldName}" to "${newName}"`);
      
      await reply(`✏️ 『 GROUP RENAMED 』 ✏️
═══════════════════════════
${decorations.fire} Name Updated
═══════════════════════════

◈ CHANGES
═══════════════════════════
📝 Old: ${oldName}
📝 New: ${newName}
⏰ Time: ${timestamp}

═══════════════════════════
${decorations.sparkle} Group renamed successfully!`);
    } catch (err) {
      BotLogger.error(`Failed to rename group ${event.threadID}`, err);
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Failed to rename group

◈ POSSIBLE REASONS
═══════════════════════════
• Bot lacks admin permissions
• Name contains invalid characters`);
    }
  }
};

export default command;
