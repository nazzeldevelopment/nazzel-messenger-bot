import type { Command, CommandContext } from '../../types/index.js';
import { safeGetThreadList } from '../../lib/apiHelpers.js';

const command: Command = {
  name: 'groups',
  aliases: ['threads', 'chats'],
  description: 'List all groups the bot is in',
  category: 'admin',
  usage: 'groups [page]',
  examples: ['groups', 'groups 2'],
  ownerOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { api, args, reply } = context;
    
    const page = parseInt(args[0]) || 1;
    const perPage = 10;
    
    try {
      const threads = await safeGetThreadList(api, 100, null, []);
      
      if (!threads || threads.length === 0) {
        await reply('❌ Unable to fetch groups list. Please try again later.');
        return;
      }
      
      const groups = threads.filter((t: any) => t.isGroup);
      const totalPages = Math.ceil(groups.length / perPage);
      const currentPage = Math.min(Math.max(1, page), totalPages);
      
      const startIdx = (currentPage - 1) * perPage;
      const pageGroups = groups.slice(startIdx, startIdx + perPage);
      
      let response = `╔═══════════════════════════════╗\n`;
      response += `║ 👥 BOT GROUPS\n`;
      response += `╠═══════════════════════════════╣\n`;
      
      for (let i = 0; i < pageGroups.length; i++) {
        const group = pageGroups[i];
        const name = group.name || 'Unnamed Group';
        const members = group.participantIDs?.length || 0;
        
        response += `║ ${startIdx + i + 1}. ${name}\n`;
        response += `║    ID: ${group.threadID}\n`;
        response += `║    Members: ${members}\n`;
        response += `║\n`;
      }
      
      response += `╠═══════════════════════════════╣\n`;
      response += `║ Page ${currentPage}/${totalPages} | Total: ${groups.length} groups\n`;
      response += `╚═══════════════════════════════╝`;
      
      await reply(response);
    } catch (error) {
      await reply('❌ Failed to fetch groups list.');
    }
  }
};

export default command;
