import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { decorations } from '../../lib/messageFormatter.js';

const command: Command = {
  name: 'kickid',
  aliases: ['removeid', 'bootid'],
  description: 'Remove a member from the group using their User ID',
  category: 'admin',
  usage: 'kickid <userID>',
  examples: ['kickid 123456789012345'],
  adminOnly: true,
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, args, reply, prefix } = context;
    
    if (!args[0] || !/^\d+$/.test(args[0])) {
      await reply(`🔨 『 KICK BY ID 』 🔨
═══════════════════════════
${decorations.fire} Remove user by ID
═══════════════════════════

◈ USAGE
═══════════════════════════
➤ ${prefix}kickid <userID>

◈ EXAMPLE
═══════════════════════════
➤ ${prefix}kickid 123456789012345`);
      return;
    }
    
    const targetId = args[0].trim();
    
    if (targetId === String(event.senderID)) {
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ You cannot kick yourself!`);
      return;
    }
    
    try {
      const userInfo = await api.getUserInfo(targetId);
      const userName = userInfo[targetId]?.name || 'Unknown';
      
      const threadId = String(event.threadID);
      await api.removeUserFromGroup(targetId, threadId);
      
      const timestamp = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      
      BotLogger.info(`Kicked user ${targetId} (${userName}) from group ${threadId}`);
      
      await reply(`🔨 『 USER KICKED 』 🔨
═══════════════════════════
${decorations.fire} Successfully Removed
═══════════════════════════

◈ USER INFO
═══════════════════════════
👤 Name: ${userName}
🆔 ID: ${targetId}
⏰ Time: ${timestamp}
✅ Status: Removed

═══════════════════════════
${decorations.sparkle} User has been kicked`);
    } catch (err) {
      BotLogger.error(`Failed to kick user ${targetId}`, err);
      await reply(`${decorations.fire} 『 KICK FAILED 』
═══════════════════════════
❌ Failed to remove user

◈ POSSIBLE REASONS
═══════════════════════════
• Bot lacks admin permissions
• User already removed
• User is a group admin
• Invalid user ID`);
    }
  }
};

export default command;
