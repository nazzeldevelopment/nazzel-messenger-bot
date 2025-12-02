import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'uptime',
  aliases: ['up'],
  description: 'Show how long the bot has been running',
  category: 'general',
  usage: 'uptime',
  examples: ['uptime'],

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    const parts: string[] = [];
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
    if (seconds > 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
    
    const uptimeStr = parts.join(', ') || '0 seconds';
    
    const startTime = new Date(Date.now() - uptime * 1000);
    const startTimeStr = startTime.toLocaleString();
    
    const response = `╔═══════════════════════════════╗
║ ⏱️ BOT UPTIME
╠═══════════════════════════════╣
║ Running for: ${uptimeStr}
║ Started at: ${startTimeStr}
╚═══════════════════════════════╝`;
    
    await reply(response);
  }
};

export default command;
