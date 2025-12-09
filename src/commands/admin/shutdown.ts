import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';
import { redis } from '../../lib/redis.js';
import { BotLogger } from '../../lib/logger.js';

const command: Command = {
  name: 'shutdown',
  aliases: ['die', 'off'],
  description: 'Shutdown the bot completely (Owner only)',
  category: 'admin',
  usage: 'shutdown [confirm]',
  examples: ['shutdown', 'shutdown confirm'],
  cooldown: 30000,
  ownerOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { reply, args, prefix } = context;
    
    if (args[0]?.toLowerCase() !== 'confirm') {
      await reply(`╭─────────────────╮
│   ⚠️ SHUTDOWN   │
╰─────────────────╯

This will completely shut
down the bot!

The bot will go offline and
will NOT restart automatically.

💡 Type to confirm:
${prefix}shutdown confirm

╭─────────────────╮
│ 💗 Wisdom Bot
╰─────────────────╯`);
      return;
    }
    
    await reply(`╭─────────────────╮
│   🔴 SHUTDOWN   │
╰─────────────────╯
⚠️ Initiating shutdown...
💾 Saving all data...
🔌 Closing connections...

👋 Bot going offline now!`);
    
    BotLogger.info('Bot shutdown initiated by owner');
    
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
        
        process.kill(process.pid, 'SIGTERM');
        
        setTimeout(() => {
          process.exit(0);
        }, 1000);
      } catch (e) {
        console.log('  [ERROR]           Shutdown error, forcing exit');
        process.exit(1);
      }
    }, 2000);
  }
};

export default command;
