import type { Command, CommandContext } from '../../types/index.js';
import config from '../../../config.json' with { type: 'json' };

const command: Command = {
  name: 'info',
  aliases: ['botinfo', 'bot'],
  description: 'Display bot information and statistics',
  category: 'general',
  usage: 'info',
  examples: ['info'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { reply, commands } = context;
    
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const mem = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    
    await reply(`🤖 ${config.bot.name}
━━━━━━━━━━━━━━━
📦 v${config.bot.version}
🔧 ${config.bot.prefix}
📋 ${commands.size} commands
━━━━━━━━━━━━━━━
⏱️ ${h}h ${m}m
💾 ${mem}MB
🖥️ ${process.version}
━━━━━━━━━━━━━━━
🟢 XP • 🟢 Music
🟢 Welcome • 🟢 Filter`);
  }
};

export default command;
