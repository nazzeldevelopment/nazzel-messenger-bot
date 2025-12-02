import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';
import os from 'os';

const command: Command = {
  name: 'stats',
  aliases: ['statistics', 'botstats'],
  description: 'View detailed bot statistics',
  category: 'admin',
  usage: 'stats',
  examples: ['stats'],
  ownerOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    
    try {
      const commandStats = await database.getCommandStats();
      const topCommands = commandStats.slice(0, 5);
      
      const memUsage = process.memoryUsage();
      const memUsedMB = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
      const memTotalMB = (memUsage.heapTotal / 1024 / 1024).toFixed(2);
      
      const uptime = process.uptime();
      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      
      const cpuUsage = os.loadavg()[0].toFixed(2);
      const totalMemGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
      const freeMemGB = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
      
      let response = `╔═══════════════════════════════╗\n`;
      response += `║ 📊 BOT STATISTICS\n`;
      response += `╠═══════════════════════════════╣\n`;
      response += `║ ⏱️ UPTIME\n`;
      response += `║ ${days}d ${hours}h ${minutes}m\n`;
      response += `╠═══════════════════════════════╣\n`;
      response += `║ 💾 MEMORY\n`;
      response += `║ Bot: ${memUsedMB}MB / ${memTotalMB}MB\n`;
      response += `║ System: ${freeMemGB}GB free / ${totalMemGB}GB\n`;
      response += `╠═══════════════════════════════╣\n`;
      response += `║ 🖥️ SYSTEM\n`;
      response += `║ CPU Load: ${cpuUsage}%\n`;
      response += `║ Platform: ${os.platform()}\n`;
      response += `║ Node.js: ${process.version}\n`;
      response += `╠═══════════════════════════════╣\n`;
      response += `║ 📈 TOP COMMANDS\n`;
      
      for (const cmd of topCommands) {
        response += `║ • ${cmd.command}: ${cmd.count} uses\n`;
      }
      
      response += `╚═══════════════════════════════╝`;
      
      await reply(response);
    } catch (error) {
      await reply('❌ Failed to fetch statistics.');
    }
  }
};

export default command;
