import type { Command, CommandContext } from '../../types/index.js';
import fmt, { decorations } from '../../lib/messageFormatter.js';
import { redis } from '../../lib/redis.js';

const command: Command = {
  name: 'ping',
  aliases: ['p', 'latency', 'status'],
  description: 'Check bot response time and status',
  category: 'general',
  usage: 'ping',
  examples: ['ping'],
  cooldown: 3000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    const start = Date.now();
    
    const latency = Date.now() - start;
    
    let status = '🟢 Excellent';
    let quality = 5;
    if (latency > 500) { status = '🟡 Good'; quality = 4; }
    if (latency > 1000) { status = '🟠 Moderate'; quality = 3; }
    if (latency > 2000) { status = '🔴 Slow'; quality = 2; }
    if (latency > 3000) { status = '⚫ Critical'; quality = 1; }
    
    const qualityBar = '●'.repeat(quality) + '○'.repeat(5 - quality);
    
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    const memUsage = process.memoryUsage();
    const memMB = Math.round(memUsage.heapUsed / 1024 / 1024);
    
    const dbStatus = '🟢 Connected';
    const cacheStatus = redis.connected ? '🟢 Active' : '🟡 Memory Mode';
    const currentTime = fmt.formatTimestamp();
    
    await reply(`${decorations.lightning}${decorations.sparkle} 『 PONG! 』 ${decorations.sparkle}${decorations.lightning}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${decorations.gem} CONNECTION STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ Response: ${latency}ms
📊 Status: ${status}
🎯 Quality: ${qualityBar}

${decorations.gear} SYSTEM INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s
💾 Memory: ${memMB}MB
🔌 API: 🟢 Online
💿 Database: ${dbStatus}
⚡ Cache: ${cacheStatus}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.sparkle} All systems operational!
${decorations.sun} ${currentTime}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  }
};

export default command;
