import type { Command, CommandContext } from '../../types/index.js';
import { safeGetThreadInfo } from '../../lib/apiHelpers.js';

const command: Command = {
  name: 'thread',
  aliases: ['group', 'gc', 'threadinfo'],
  description: 'Show information about the current thread/group',
  category: 'utility',
  usage: 'thread',
  examples: ['thread'],

  async execute(context: CommandContext): Promise<void> {
    const { api, event, reply } = context;
    
    try {
      const threadId = ('' + event.threadID).trim();
      const threadInfo = await safeGetThreadInfo(api, threadId);
      
      const admins = threadInfo.adminIDs?.map((a: any) => a.id) || [];
      
      let response = `╔═══════════════════════════════╗\n`;
      response += `║ 👥 THREAD INFO\n`;
      response += `╠═══════════════════════════════╣\n`;
      response += `║ Name: ${threadInfo.threadName || 'Unnamed'}\n`;
      response += `║ ID: ${threadInfo.threadID}\n`;
      response += `║ Members: ${threadInfo.participantIDs?.length || 0}\n`;
      response += `║ Admins: ${admins.length}\n`;
      response += `║ Messages: ${threadInfo.messageCount || 'N/A'}\n`;
      
      if (threadInfo.emoji) {
        response += `║ Emoji: ${threadInfo.emoji}\n`;
      }
      
      response += `╚═══════════════════════════════╝`;
      
      await reply(response);
    } catch (error) {
      await reply('❌ Failed to fetch thread info. This command only works in groups.');
    }
  }
};

export default command;
