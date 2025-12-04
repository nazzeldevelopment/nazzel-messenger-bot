import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';
import { redis } from '../../lib/redis.js';

const command: Command = {
  name: 'shutdown',
  aliases: ['die', 'stop', 'off'],
  description: 'Shutdown the bot gracefully (Owner only)',
  category: 'admin',
  usage: 'shutdown',
  examples: ['shutdown'],
  cooldown: 30000,
  ownerOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { reply, api } = context;
    
    await reply(`🔴 SHUTDOWN
━━━━━━━━━━━━━━━
⚠️ Bot shutting down...
💾 Saving data...
🔌 Disconnecting...
━━━━━━━━━━━━━━━
👋 Goodbye!`);
    
    setTimeout(async () => {
      try {
        await redis.disconnect();
        await database.disconnect();
      } catch (e) {}
      
      process.kill(process.pid, 'SIGTERM');
    }, 2000);
  }
};

export default command;
