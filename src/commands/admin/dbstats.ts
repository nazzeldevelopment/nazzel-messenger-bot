import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { database } from '../../database/index.js';

const command: Command = {
  name: 'dbstats',
  aliases: ['databasestats', 'dbinfo'],
  description: 'View database statistics',
  category: 'admin',
  usage: 'dbstats',
  examples: ['dbstats'],
  ownerOnly: true,
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    
    try {
      const totalUsers = await database.getTotalUsers();
      const totalThreads = await database.getTotalThreads();
      const commandStats = await database.getCommandStats();
      const topCommands = commandStats.slice(0, 5);
      
      let topCmdsList = '';
      for (let i = 0; i < topCommands.length; i++) {
        topCmdsList += `${i + 1}. ${topCommands[i].command}: ${topCommands[i].count.toLocaleString()}\n`;
      }
      
      const totalCommands = commandStats.reduce((acc, stat) => acc + stat.count, 0);
      
      const timestamp = new Date().toLocaleString('en-PH', {
        timeZone: 'Asia/Manila',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      await reply(`╭─────────────────╮
│ 📊 DATABASE STATS
╰─────────────────╯

◈ COLLECTIONS
👥 Users: ${totalUsers.toLocaleString()}
💬 Threads: ${totalThreads.toLocaleString()}
📊 Commands: ${totalCommands.toLocaleString()}

◈ TOP COMMANDS
${topCmdsList || 'No data yet'}

◈ STATUS
✅ Database: Connected
🗄️ Type: MongoDB

⏰ ${timestamp}
╭─────────────────╮
│ 💗 Wisdom Bot
╰─────────────────╯`);
      
      BotLogger.info('Database stats retrieved');
    } catch (err) {
      BotLogger.error('Failed to get database stats', err);
      await reply(`╭─────────────────╮
│ ❌ ERROR
╰─────────────────╯
Failed to get database stats.`);
    }
  }
};

export default command;
