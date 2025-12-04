import type { Command, CommandContext } from '../../types/index.js';

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
    const d = Math.floor(uptime / 86400);
    const h = Math.floor((uptime % 86400) / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    
    let uptimeStr = '';
    if (d > 0) uptimeStr += `${d}d `;
    if (h > 0) uptimeStr += `${h}h `;
    if (m > 0) uptimeStr += `${m}m `;
    uptimeStr += `${s}s`;
    
    await reply(`⏱️ UPTIME
━━━━━━━━━━━━━━━
🟢 ${uptimeStr.trim()}
━━━━━━━━━━━━━━━`);
  }
};

export default command;
