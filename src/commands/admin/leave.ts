import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';

const command: Command = {
  name: 'leave',
  aliases: ['leavegroup', 'exitgroup'],
  description: 'Make the bot leave a group chat (Owner only)',
  category: 'admin',
  usage: 'leave [threadId]',
  examples: ['leave', 'leave 123456789'],
  cooldown: 10000,
  ownerOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, reply, args } = context;
    
    const targetThread = args[0] ? String(args[0]).trim() : String(event.threadID);
    const botId = String(api.getCurrentUserID());
    
    try {
      let groupName = 'this group';
      
      try {
        const threadInfo = await api.getThreadInfo(targetThread);
        groupName = threadInfo.name || 'Group Chat';
      } catch (e) {}
      
      await reply(`👋 LEAVING
━━━━━━━━━━━━━━━
🏠 ${groupName}
🆔 ${targetThread}
━━━━━━━━━━━━━━━
Goodbye everyone!`);
      
      await new Promise(r => setTimeout(r, 1000));
      
      await api.removeUserFromGroup(botId, targetThread);
      
      BotLogger.info(`Bot left group: ${targetThread} (${groupName})`);
      
    } catch (err) {
      BotLogger.error(`Failed to leave group ${targetThread}`, err);
      await reply(`❌ LEAVE FAILED
━━━━━━━━━━━━━━━
Could not leave the group.
Check if threadId is valid.`);
    }
  }
};

export default command;
