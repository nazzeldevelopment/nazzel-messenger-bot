import type { Command, CommandContext } from '../../types/index.js';
import os from 'os';
import config from '../../../config.json' with { type: 'json' };

const command: Command = {
  name: 'info',
  aliases: ['botinfo', 'about'],
  description: 'Display bot information and statistics',
  category: 'general',
  usage: 'info',
  examples: ['info'],

  async execute(context: CommandContext): Promise<void> {
    const { reply, commands } = context;
    
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    const memUsage = process.memoryUsage();
    const memUsedMB = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
    const memTotalMB = (memUsage.heapTotal / 1024 / 1024).toFixed(2);
    
    const categories = new Set<string>();
    commands.forEach(cmd => categories.add(cmd.category));
    
    const response = `╔═══════════════════════════════╗
║     ${config.bot.name.toUpperCase()}
║     v${config.bot.version}
╠═══════════════════════════════╣
║ 📋 GENERAL INFO
╠═══════════════════════════════╣
║ Prefix: ${config.bot.prefix}
║ Commands: ${commands.size}
║ Categories: ${categories.size}
╠═══════════════════════════════╣
║ 📊 STATISTICS
╠═══════════════════════════════╣
║ Uptime: ${hours}h ${minutes}m ${seconds}s
║ Memory: ${memUsedMB}MB / ${memTotalMB}MB
║ Node.js: ${process.version}
║ Platform: ${os.platform()}
╠═══════════════════════════════╣
║ ⚙️ FEATURES
╠═══════════════════════════════╣
║ XP System: ${config.features.xp.enabled ? '✅' : '❌'}
║ Music Player: ${config.features.music.enabled ? '✅' : '❌'}
║ Auto Welcome: ${config.features.welcome.enabled ? '✅' : '❌'}
╚═══════════════════════════════╝`;
    
    await reply(response);
  }
};

export default command;
