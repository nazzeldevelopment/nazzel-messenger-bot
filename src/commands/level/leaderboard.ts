import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';
import { safeGetUserInfo } from '../../lib/apiHelpers.js';

const command: Command = {
  name: 'leaderboard',
  aliases: ['lb', 'top', 'ranking'],
  description: 'Show the top users by level',
  category: 'level',
  usage: 'leaderboard [limit]',
  examples: ['leaderboard', 'leaderboard 20'],
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { api, args, reply } = context;
    
    const limit = Math.min(parseInt(args[0]) || 10, 25);
    
    try {
      const leaderboard = await database.getLeaderboard(limit);
      
      if (leaderboard.length === 0) {
        await reply(`🏆 No users yet!
━━━━━━━━━━━━━━━
💬 Start chatting!`);
        return;
      }
      
      const userIds = leaderboard.map(u => ('' + u.id).trim());
      const userInfos = await safeGetUserInfo(api, userIds);
      
      const medals = ['🥇', '🥈', '🥉'];
      
      let response = `🏆 TOP ${limit}
━━━━━━━━━━━━━━━\n`;
      
      for (let i = 0; i < leaderboard.length; i++) {
        const user = leaderboard[i];
        const name = userInfos[user.id]?.name || user.name || 'Unknown';
        const short = name.length > 10 ? name.substring(0, 10) + '..' : name;
        const medal = medals[i] || `${i + 1}.`;
        response += `${medal} ${short} Lv${user.level}\n`;
      }
      
      response += `━━━━━━━━━━━━━━━`;
      
      await reply(response);
    } catch (error) {
      await reply(`❌ Failed to load`);
    }
  }
};

export default command;
