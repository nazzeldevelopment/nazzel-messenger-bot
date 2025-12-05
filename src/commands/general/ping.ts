import type { Command, CommandContext } from '../../types/index.js';
import { redis } from '../../lib/redis.js';
import config from '../../../config.json' with { type: 'json' };

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
    
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    
    const mem = process.memoryUsage();
    const heapUsed = Math.round(mem.heapUsed / 1024 / 1024);
    
    const latency = Date.now() - start;
    
    let statusEmoji = '🟢';
    if (latency > 300) statusEmoji = '🟡';
    if (latency > 700) statusEmoji = '🔴';

    await reply(`╭─────────────────╮
│ ⚡ PONG!
╰─────────────────╯

${statusEmoji} Latency: ${latency}ms
⏱️ Uptime: ${hours}h ${minutes}m
🧠 Memory: ${heapUsed}MB
📦 ${config.bot.name} v${config.bot.version}`);
  }
};

export default command;
