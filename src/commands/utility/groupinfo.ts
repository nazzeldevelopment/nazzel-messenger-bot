import type { Command, CommandContext } from '../../types/index.js';

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
      const threadInfo = await api.getThreadInfo(threadId);
      
      if (!threadInfo.isGroup) {
        await reply('This command can only be used in group chats.');
        return;
      }
      
      const name = threadInfo.name || 'Unnamed Group';
      const memberCount = threadInfo.participantIDs?.length || 0;
      const adminCount = threadInfo.adminIDs?.length || 0;
      const emoji = threadInfo.emoji || 'None set';
      const color = threadInfo.color || 'Default';
      const messageCount = threadInfo.messageCount || 'Unknown';
      
      const admins: string[] = [];
      if (threadInfo.adminIDs && threadInfo.adminIDs.length > 0) {
        const adminIds = threadInfo.adminIDs.map((a: any) => a.id || a);
        try {
          const adminInfo = await api.getUserInfo(adminIds);
          for (const adminId of adminIds) {
            const adminName = adminInfo[adminId]?.name || adminId;
            admins.push(adminName);
          }
        } catch (e) {
          admins.push('Could not fetch admin names');
        }
      }
      
      const createdAt = threadInfo.timestamp 
        ? new Date(threadInfo.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'Unknown';
      
      let adminList = admins.length > 0 
        ? admins.slice(0, 5).join('\n║  - ') 
        : 'No admins';
      if (admins.length > 5) {
        adminList += `\n║  ... and ${admins.length - 5} more`;
      }
      
      await reply(`
╔══════════════════════════════════════════════╗
║                                              ║
║           GROUP INFORMATION                 ║
║                                              ║
╠══════════════════════════════════════════════╣
║  DETAILS                                    ║
╠══════════════════════════════════════════════╣
║                                              ║
║  Name: ${name}
║  Thread ID: ${threadId}
║  Members: ${memberCount}
║  Admins: ${adminCount}
║  Emoji: ${emoji}
║  Theme: ${color}
║  Messages: ${messageCount}
║  Created: ${createdAt}
║                                              ║
╠══════════════════════════════════════════════╣
║  ADMINISTRATORS                             ║
╠══════════════════════════════════════════════╣
║                                              ║
║  - ${adminList}
║                                              ║
╚══════════════════════════════════════════════╝`);
    } catch (error) {
      await reply('Failed to get group information. Please try again.');
    }
  },
};

export default command;
