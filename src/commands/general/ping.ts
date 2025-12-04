import type { Command, CommandContext } from '../../types/index.js';
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
    
    let status = '🟢';
    if (latency > 500) status = '🟡';
    if (latency > 1000) status = '🟠';
    if (latency > 2000) status = '🔴';
    
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const mem = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    
    await reply(`⚡ PONG!
━━━━━━━━━━━━━━━
${status} ${latency}ms
⏱️ ${h}h ${m}m
💾 ${mem}MB
🔌 ${redis.connected ? '🟢' : '🟡'} Cache
━━━━━━━━━━━━━━━`);
  }
};

export default command;
