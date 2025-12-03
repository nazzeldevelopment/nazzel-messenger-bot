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
    const { api, event, args, reply } = context;
    
    let targetId: string | null = null;
    
    if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = ('' + Object.keys(event.mentions)[0]).trim();
    } else if (args[0] && /^\d+$/.test(args[0])) {
      targetId = ('' + args[0]).trim();
    }
    
    if (!targetId) {
      await reply('❌ Please mention a user or provide a user ID to kick.\nUsage: kick <@mention|userID>');
      return;
    }
    
    if (targetId === ('' + event.senderID).trim()) {
      await reply('❌ You cannot kick yourself!');
      return;
    }
    
    try {
      const userInfo = await api.getUserInfo(targetId);
      const userName = userInfo[targetId]?.name || 'Unknown';
      
      const threadId = ('' + event.threadID).trim();
      await api.removeUserFromGroup(targetId, threadId);
      
      BotLogger.info(`Kicked user ${targetId} (${userName}) from group ${threadId}`);
      
      await reply(`✅ Successfully removed ${userName} from the group.`);
    } catch (error) {
      BotLogger.error(`Failed to kick user ${targetId}`, error);
      await reply('❌ Failed to remove user. Make sure the bot has admin permissions.');
    }
  }
};

export default command;
