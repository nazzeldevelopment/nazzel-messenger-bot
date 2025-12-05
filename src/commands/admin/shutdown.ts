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
    const { reply, prefix } = context;
    
    await reply(`╭─────────────────╮
│   🔴 SHUTDOWN   │
╰─────────────────╯
⚠️ Initiating shutdown...
💾 Saving all data...
🔌 Closing connections...

👋 Bot going offline now!`);
    
    setTimeout(async () => {
      try {
        console.log('═══════════════════════ SHUTDOWN INITIATED ═══════════════════════');
        console.log('  [STATUS]          Shutdown command executed');
        
        await redis.disconnect();
        console.log('  [REDIS]           Disconnected');
        
        await database.disconnect();
        console.log('  [MONGODB]         Disconnected');
        
        console.log('  [STATUS]          Cleanup complete. Goodbye!');
        console.log('═════════════════════════════════════════════════════════════════');
        
        process.exit(0);
      } catch (e) {
        console.log('  [ERROR]           Shutdown error, forcing exit');
        process.exit(1);
      }
    }, 1500);
  }
};

export default command;
