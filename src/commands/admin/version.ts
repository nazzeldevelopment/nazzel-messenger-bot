import type { Command, CommandContext } from '../../types/index.js';
import config from '../../../config.json' with { type: 'json' };

const command: Command = {
  name: 'version',
  aliases: ['ver', 'v', 'botversion'],
  description: 'Show bot version and system information',
  category: 'admin',
  usage: 'version',
  examples: ['version'],
  adminOnly: false,
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    
    const nodeVersion = process.version;
    const platform = process.platform;
    const arch = process.arch;
    const uptime = process.uptime();
    
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    let uptimeStr = '';
    if (days > 0) uptimeStr += `${days}d `;
    if (hours > 0) uptimeStr += `${hours}h `;
    if (minutes > 0) uptimeStr += `${minutes}m `;
    uptimeStr += `${seconds}s`;
    
    const memUsage = process.memoryUsage();
    const heapUsed = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
    const heapTotal = (memUsage.heapTotal / 1024 / 1024).toFixed(2);
    
    const timestamp = new Date().toLocaleString('en-PH', {
      timeZone: 'Asia/Manila',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    await reply(`╭─────────────────╮
│ 📦 BOT VERSION
╰─────────────────╯

◈ BOT INFO
🤖 Name: ${config.bot.name}
📦 Version: v${config.bot.version}
🔧 Prefix: ${config.bot.prefix}

◈ SYSTEM
⚙️ Node.js: ${nodeVersion}
💻 Platform: ${platform}
🏗️ Arch: ${arch}

◈ PERFORMANCE
⏱️ Uptime: ${uptimeStr}
💾 Memory: ${heapUsed}/${heapTotal} MB

⏰ ${timestamp}
╭─────────────────╮
│ 💗 Wisdom Bot
╰─────────────────╯`);
  }
};

export default command;
