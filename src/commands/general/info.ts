import type { Command, CommandContext } from '../../types/index.js';
import os from 'os';
import config from '../../../config.json' with { type: 'json' };
import { decorations } from '../../lib/messageFormatter.js';
import fmt from '../../lib/messageFormatter.js';

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
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    const memUsage = process.memoryUsage();
    const memUsedMB = (memUsage.heapUsed / 1024 / 1024).toFixed(1);
    const memTotalMB = (memUsage.heapTotal / 1024 / 1024).toFixed(1);
    const memPercent = Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100);
    const memBar = fmt.createProgressBar(memUsage.heapUsed, memUsage.heapTotal, 10);
    
    const categories = new Set<string>();
    commands.forEach(cmd => categories.add(cmd.category));
    
    const uptimeStr = days > 0 
      ? `${days}d ${hours}h ${minutes}m` 
      : `${hours}h ${minutes}m ${seconds}s`;
    
    await reply(`${decorations.gem} 『 BOT INFORMATION 』 ${decorations.gem}
━━━━━━━━━━━━━━━━━━━━━━━━━

◈ GENERAL
━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 Name: ${config.bot.name}
📦 Version: ${config.bot.version}
🔧 Prefix: ${config.bot.prefix}
📋 Commands: ${commands.size}
📁 Categories: ${categories.size}

◈ SYSTEM STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ Uptime: ${uptimeStr}
💾 Memory: ${memUsedMB}/${memTotalMB}MB
📊 ${memBar}
🖥️ Node: ${process.version}
💿 OS: ${os.platform()} ${os.arch()}

◈ FEATURES STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━
${config.features.xp.enabled ? '🟢' : '🔴'} XP System
${config.features.music.enabled ? '🟢' : '🔴'} Music Player
${config.features.welcome.enabled ? '🟢' : '🔴'} Auto Welcome
🟢 Anti-Spam
🟢 Bad Words Filter
🟢 Maintenance Mode

━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Use ${config.bot.prefix}help to see commands`);
  }
};

export default command;
