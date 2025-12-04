import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { adminMessage, error, info } from '../../lib/messageFormatter.js';

const command: Command = {
  name: 'kick',
  aliases: ['remove', 'boot'],
  description: 'Remove a member from the group',
  category: 'admin',
  usage: 'kick <@mention|userID>',
  examples: ['kick @user', 'kick 123456789'],
  adminOnly: true,
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, args, reply, prefix } = context;
    
    let targetId: string | null = null;
    
    if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = ('' + Object.keys(event.mentions)[0]).trim();
    } else if (args[0] && /^\d+$/.test(args[0])) {
      targetId = ('' + args[0]).trim();
    }
    
    if (!targetId) {
      await reply(info('KICK USER', 
        `Please mention a user or provide their ID to kick.\n\nUsage: ${prefix}kick @user\nExample: ${prefix}kick 123456789`
      ));
      return;
    }
    
    if (targetId === ('' + event.senderID).trim()) {
      await reply(error('KICK DENIED', 'You cannot kick yourself from the group!'));
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
      
      await reply(adminMessage('USER KICKED', 
        `${userName} has been removed from the group.`,
        [
          { label: '👤 Name', value: userName },
          { label: '🆔 ID', value: targetId },
          { label: '⏰ Time', value: timestamp },
          { label: '✅ Status', value: 'Successfully Removed' }
        ]
      ));
    } catch (err) {
      BotLogger.error(`Failed to kick user ${targetId}`, err);
      await reply(error('KICK FAILED', 
        'Failed to remove user.\n\nPossible reasons:\n• Bot lacks admin permissions\n• User already removed\n• User is a group admin'
      ));
    }
  }
};

export default command;
