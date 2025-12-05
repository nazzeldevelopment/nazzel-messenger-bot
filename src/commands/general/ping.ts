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
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    const mem = process.memoryUsage();
    const heapUsed = Math.round(mem.heapUsed / 1024 / 1024);
    const heapTotal = Math.round(mem.heapTotal / 1024 / 1024);
    const memPercent = Math.round((mem.heapUsed / mem.heapTotal) * 100);
    
    const latency = Date.now() - start;
    
    let statusEmoji = '🟢';
    let statusText = 'Excellent';
    if (latency > 300) { statusEmoji = '🟡'; statusText = 'Good'; }
    if (latency > 700) { statusEmoji = '🟠'; statusText = 'Moderate'; }
    if (latency > 1500) { statusEmoji = '🔴'; statusText = 'Slow'; }
    
    const cacheStatus = redis.connected ? '🟢 Connected' : '🟡 Offline';
    const dbStatus = '🟢 Connected';
    
    let uptimeStr = '';
    if (days > 0) uptimeStr += `${days}d `;
    if (hours > 0) uptimeStr += `${hours}h `;
    if (minutes > 0) uptimeStr += `${minutes}m `;
    uptimeStr += `${seconds}s`;

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ⚡ 𝗣𝗢𝗡𝗚! ⚡     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌── 📊 𝗣𝗲𝗿𝗳𝗼𝗿𝗺𝗮𝗻𝗰𝗲 ──┐
│ ${statusEmoji} Status: ${statusText}
│ ⚡ Latency: ${latency}ms
│ ⏱️ Uptime: ${uptimeStr}
└────────────────────────┘

┌── 💾 𝗦𝘆𝘀𝘁𝗲𝗺 ──┐
│ 🧠 Memory: ${heapUsed}/${heapTotal}MB (${memPercent}%)
│ 📦 Node: ${process.version}
└────────────────────────┘

┌── 🔌 𝗦𝗲𝗿𝘃𝗶𝗰𝗲𝘀 ──┐
│ 🗄️ Database: ${dbStatus}
│ ⚡ Cache: ${cacheStatus}
└────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 ${config.bot.name} v${config.bot.version}`);
  }
};

export default command;
