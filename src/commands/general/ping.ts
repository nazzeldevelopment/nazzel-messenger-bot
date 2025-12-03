import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'ping',
  aliases: ['p', 'latency'],
  description: 'Check bot latency and response time',
  category: 'general',
  usage: 'ping',
  examples: ['ping'],

  async execute(context: CommandContext): Promise<void> {
    const { api, event, reply } = context;
    const start = Date.now();
    const threadId = String(event.threadID);
    
    await new Promise<void>((resolve, reject) => {
      api.sendMessage('🏓 Pinging...', threadId, (err: Error | null) => {
        if (err) reject(err);
        else resolve();
      });
    });
    
    const latency = Date.now() - start;
    
    let status = '🟢 Excellent';
    if (latency > 500) status = '🟡 Good';
    if (latency > 1000) status = '🟠 Moderate';
    if (latency > 2000) status = '🔴 Slow';
    
    const response = `╔═══════════════════════╗
║ 🏓 PONG!
╠═══════════════════════╣
║ Latency: ${latency}ms
║ Status: ${status}
║ API: Online
╚═══════════════════════╝`;
    
    await reply(response);
  }
};

export default command;
