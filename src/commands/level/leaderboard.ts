import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';

const command: Command = {
  name: 'leaderboard',
  aliases: ['lb', 'top', 'ranking'],
  description: 'Show the top users by level',
  category: 'level',
  usage: 'leaderboard [limit]',
  examples: ['leaderboard', 'leaderboard 20'],

  async execute(context: CommandContext): Promise<void> {
    const { api, args, reply } = context;
    
    const limit = Math.min(parseInt(args[0]) || 10, 25);
    
    try {
      const leaderboard = await database.getLeaderboard(limit);
      
      if (leaderboard.length === 0) {
        await reply('📋 No users on the leaderboard yet!');
        return;
      }
      
      const userIds = leaderboard.map(u => ('' + u.id).trim());
      const userInfos = await api.getUserInfo(userIds);
      
      let response = `╔═══════════════════════════════╗\n`;
      response += `║ 🏆 LEADERBOARD - TOP ${limit}\n`;
      response += `╠═══════════════════════════════╣\n`;
      
      const medals = ['🥇', '🥈', '🥉'];
      
      for (let i = 0; i < leaderboard.length; i++) {
        const user = leaderboard[i];
        const name = userInfos[user.id]?.name || user.name || 'Unknown';
        const displayName = name.length > 15 ? name.substring(0, 15) + '...' : name;
        const medal = medals[i] || `${i + 1}.`;
        
        response += `║ ${medal} ${displayName}\n`;
        response += `║    Lv.${user.level} | XP: ${user.xp} | 💬 ${user.totalMessages}\n`;
      }
      
      response += `╚═══════════════════════════════╝`;
      
      await reply(response);
    } catch (error) {
      await reply('❌ Failed to fetch leaderboard.');
    }
  }
};

export default command;
