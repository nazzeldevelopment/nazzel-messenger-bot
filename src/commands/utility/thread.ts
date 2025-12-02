import type { Command, CommandContext } from '../../types/index.js';

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
      const threadInfo = await new Promise<{
        threadID: string;
        threadName: string;
        participantIDs: string[];
        adminIDs: Array<{ id: string }>;
        messageCount: number;
        emoji: string;
        color: string;
      }>((resolve, reject) => {
        api.getThreadInfo(event.threadID, (err: Error | null, info: any) => {
          if (err) reject(err);
          else resolve(info);
        });
      });
      
      const admins = threadInfo.adminIDs?.map(a => a.id) || [];
      
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
