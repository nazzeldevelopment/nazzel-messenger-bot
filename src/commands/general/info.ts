import type { Command, CommandContext } from '../../types/index.js';
import os from 'os';
import config from '../../../config.json' with { type: 'json' };

const command: Command = {
  name: 'info',
  aliases: ['botinfo', 'bot'],
  description: 'Display bot information and statistics',
  category: 'general',
  usage: 'info',
  examples: ['info'],

  async execute(context: CommandContext): Promise<void> {
    const { reply, commands } = context;
    
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    const memUsage = process.memoryUsage();
    const memUsedMB = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
    const memTotalMB = (memUsage.heapTotal / 1024 / 1024).toFixed(2);
    const memPercent = Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100);
    const memBar = '█'.repeat(Math.floor(memPercent / 10)) + '░'.repeat(10 - Math.floor(memPercent / 10));
    
    const categories = new Set<string>();
    commands.forEach(cmd => categories.add(cmd.category));
    
    const uptimeStr = days > 0 ? `${days}d ${hours}h ${minutes}m ${seconds}s` : `${hours}h ${minutes}m ${seconds}s`;
    
    await reply(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ██╗███╗   ██╗███████╗ ██████╗                              ║
║   ██║████╗  ██║██╔════╝██╔═══██╗                             ║
║   ██║██╔██╗ ██║█████╗  ██║   ██║                             ║
║   ██║██║╚██╗██║██╔══╝  ██║   ██║                             ║
║   ██║██║ ╚████║██║     ╚██████╔╝                             ║
║   ╚═╝╚═╝  ╚═══╝╚═╝      ╚═════╝                              ║
║                                                              ║
║               ${config.bot.name.toUpperCase()} v${config.bot.version}                      ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   GENERAL INFORMATION                                       ║
║   ─────────────────────────────────────                     ║
║   Bot Name      : ${config.bot.name}                                  ║
║   Version       : ${config.bot.version}                                       ║
║   Prefix        : ${config.bot.prefix}                                            ║
║   Commands      : ${String(commands.size).padStart(3, ' ')} commands                           ║
║   Categories    : ${String(categories.size).padStart(3, ' ')} categories                          ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   SYSTEM STATISTICS                                         ║
║   ─────────────────────────────────────                     ║
║   Uptime        : ${uptimeStr}                         ║
║   Memory Usage  : ${memUsedMB} MB / ${memTotalMB} MB               ║
║   Memory        : [${memBar}] ${memPercent}%                  ║
║   Node.js       : ${process.version}                              ║
║   Platform      : ${os.platform()} ${os.arch()}                           ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   ENABLED FEATURES                                          ║
║   ─────────────────────────────────────                     ║
║   XP System         : ${config.features.xp.enabled ? '✅ Enabled' : '❌ Disabled'}                      ║
║   Music Player      : ${config.features.music.enabled ? '✅ Enabled' : '❌ Disabled'}                      ║
║   Auto Welcome      : ${config.features.welcome.enabled ? '✅ Enabled' : '❌ Disabled'}                      ║
║   Anti-Spam         : ✅ Enabled                            ║
║   Maintenance Mode  : ⚙️  Available                         ║
║   Bad Words Filter  : ✅ Enabled                            ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   Use ${config.bot.prefix}help to see all available commands.              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`);
  }
};

export default command;
