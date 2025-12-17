import type { Command, CommandContext } from '../../types/index.js';
import { commandHandler } from '../../lib/commandHandler.js';

const command: Command = {
  name: 'botstats',
  aliases: ['bs', 'statistics'],
  description: 'View detailed bot statistics',
  category: 'general',
  usage: 'botstats',
  examples: ['botstats'],
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;

    const totalCommands = commandHandler.getAllCommands().size;
    const categories = commandHandler.getCategories();
    
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    
    let categoryStats = '';
    for (const cat of categories) {
      const count = commandHandler.getCommandsByCategory(cat).length;
      categoryStats += `• ${cat}: ${count}\n`;
    }

    await reply(`╭─────────────────╮
│ 📊 BOT STATS
╰─────────────────╯

🤖 Commands: ${totalCommands}
📁 Categories: ${categories.length}
⏱️ Uptime: ${days}d ${hours}h

📂 Per Category:
${categoryStats}
🚀 Running smoothly!`);
  }
};

export default command;
