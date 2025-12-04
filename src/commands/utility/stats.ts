import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';
import config from '../../../config.json' with { type: 'json' };
import os from 'os';

const startTime = Date.now();

const command: Command = {
  name: 'botstats',
  aliases: ['botinfo', 'status', 'statistics'],
  description: 'Show detailed bot statistics and system info',
  category: 'utility',
  usage: 'botstats',
  examples: ['botstats'],

  async execute(context: CommandContext): Promise<void> {
    const { reply, api } = context;
    
    const uptime = Date.now() - startTime;
    const days = Math.floor(uptime / 86400000);
    const hours = Math.floor((uptime % 86400000) / 3600000);
    const minutes = Math.floor((uptime % 3600000) / 60000);
    const seconds = Math.floor((uptime % 60000) / 1000);
    
    const uptimeStr = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    
    const totalUsers = await database.getTotalUsers();
    const totalThreads = await database.getTotalThreads();
    const commandStats = await database.getCommandStats();
    const totalCommandsUsed = commandStats.reduce((acc, stat) => acc + stat.count, 0);
    const topCommand = commandStats[0]?.command || 'None';
    
    const memUsage = process.memoryUsage();
    const memUsedMB = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
    const memTotalMB = (memUsage.heapTotal / 1024 / 1024).toFixed(2);
    
    const cpuUsage = os.loadavg()[0].toFixed(2);
    const platform = os.platform();
    const nodeVersion = process.version;
    
    await reply(`
╔══════════════════════════════════════════════╗
║                                              ║
║           BOT STATISTICS                    ║
║                                              ║
╠══════════════════════════════════════════════╣
║  BOT INFO                                   ║
╠══════════════════════════════════════════════╣
║                                              ║
║  Name: ${config.bot.name}
║  Version: ${config.bot.version}
║  Prefix: ${config.bot.prefix}
║  Uptime: ${uptimeStr}
║                                              ║
╠══════════════════════════════════════════════╣
║  USAGE STATISTICS                           ║
╠══════════════════════════════════════════════╣
║                                              ║
║  Total Users: ${totalUsers}
║  Total Groups: ${totalThreads}
║  Commands Used: ${totalCommandsUsed}
║  Most Used: ${topCommand}
║                                              ║
╠══════════════════════════════════════════════╣
║  SYSTEM INFO                                ║
╠══════════════════════════════════════════════╣
║                                              ║
║  Platform: ${platform}
║  Node.js: ${nodeVersion}
║  Memory: ${memUsedMB}/${memTotalMB} MB
║  CPU Load: ${cpuUsage}%
║                                              ║
╚══════════════════════════════════════════════╝`);
  },
};

export default command;
