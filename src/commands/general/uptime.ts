import type { Command, CommandContext } from '../../types/index.js';
import fmt, { decorations } from '../../lib/messageFormatter.js';

const command: Command = {
  name: 'uptime',
  aliases: ['up', 'runtime'],
  description: 'Show how long the bot has been running',
  category: 'general',
  usage: 'uptime',
  examples: ['uptime'],
  cooldown: 5000,

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
    const startTimeStr = startTime.toLocaleString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Manila'
    });
    
    const totalSeconds = Math.floor(uptime);
    const uptimePercent = Math.min(100, Math.floor((totalSeconds / 86400) * 100));
    const progressBar = '█'.repeat(Math.floor(uptimePercent / 10)) + '░'.repeat(10 - Math.floor(uptimePercent / 10));
    
    const currentTime = fmt.formatTimestamp();
    
    await reply(`${decorations.sun}${decorations.sparkle} 『 BOT UPTIME 』 ${decorations.sparkle}${decorations.sun}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${decorations.trophy} RUNNING TIME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ ${uptimeStr}

${decorations.gem} SESSION INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Started: ${startTimeStr}
📊 Daily: [${progressBar}] ${uptimePercent}%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.sparkle} Bot is running smoothly!
${decorations.sun} ${currentTime}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  }
};

export default command;
