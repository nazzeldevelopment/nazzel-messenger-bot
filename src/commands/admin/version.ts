import type { Command, CommandContext } from '../../types/index.js';
import { decorations } from '../../lib/messageFormatter.js';
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
    
    await reply(`📦 『 BOT VERSION 』 📦
═══════════════════════════
${decorations.fire} System Information
═══════════════════════════

◈ BOT INFO
═══════════════════════════
🤖 Name: ${config.bot.name}
📦 Version: v${config.bot.version}
🔧 Prefix: ${config.bot.prefix}

◈ SYSTEM
═══════════════════════════
⚙️ Node.js: ${nodeVersion}
💻 Platform: ${platform}
🏗️ Architecture: ${arch}

◈ PERFORMANCE
═══════════════════════════
⏱️ Uptime: ${uptimeStr}
💾 Memory: ${heapUsed}/${heapTotal} MB

═══════════════════════════
${decorations.sparkle} Nazzel Bot - Advanced FB Bot`);
  }
};

export default command;
