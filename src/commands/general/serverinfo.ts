import type { Command, CommandContext } from '../../types/index.js';
import os from 'os';

const command: Command = {
  name: 'serverinfo',
  aliases: ['server', 'host', 'system'],
  description: 'View bot server information',
  category: 'general',
  usage: 'serverinfo',
  examples: ['serverinfo'],
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;

    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const mem = process.memoryUsage();
    const heapUsed = Math.round(mem.heapUsed / 1024 / 1024);
    const heapTotal = Math.round(mem.heapTotal / 1024 / 1024);

    const totalMem = Math.round(os.totalmem() / 1024 / 1024 / 1024);
    const freeMem = Math.round(os.freemem() / 1024 / 1024 / 1024);

    await reply(`╭─────────────────╮
│ 🖥️ SERVER
╰─────────────────╯

📊 Process:
• Uptime: ${hours}h ${minutes}m ${seconds}s
• Memory: ${heapUsed}/${heapTotal}MB
• Node: ${process.version}

💻 System:
• Platform: ${os.platform()}
• Arch: ${os.arch()}
• RAM: ${freeMem}/${totalMem}GB free
• CPUs: ${os.cpus().length} cores`);
  }
};

export default command;
