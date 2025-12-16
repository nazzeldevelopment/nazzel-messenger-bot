import type { Command, CommandContext } from '../../types/index.js';
import { safeGetThreadInfo } from '../../lib/apiHelpers.js';

const command: Command = {
  name: 'groupinfo',
  aliases: ['gi', 'group', 'gc'],
  description: 'Get detailed information about the current group',
  category: 'utility',
  usage: 'groupinfo',
  examples: ['groupinfo'],

  async execute(context: CommandContext): Promise<void> {
    const { reply, event, api } = context;
    const threadId = event.threadID;
    
    try {
      const threadInfo = await safeGetThreadInfo(api, threadId);
      
      if (!threadInfo) {
        await reply('❌ Unable to fetch group info. Please try again later.');
        return;
      }
      
      if (!threadInfo.isGroup) {
        await reply('❌ Groups only');
        return;
      }
      
      const name = threadInfo.name || 'Unnamed';
      const members = threadInfo.participantIDs?.length || 0;
      const admins = threadInfo.adminIDs?.length || 0;
      const emoji = threadInfo.emoji || '💬';
      
      await reply(`🏠 GROUP INFO
━━━━━━━━━━━━━━━
📛 ${name}
🆔 ${threadId}
━━━━━━━━━━━━━━━
👥 Members: ${members}
👑 Admins: ${admins}
${emoji} Emoji
━━━━━━━━━━━━━━━`);
    } catch (error) {
      await reply('❌ Failed to get info');
    }
  },
};

export default command;
