import type { Command, CommandContext } from '../../types/index.js';
import { commandHandler } from '../../lib/commandHandler.js';
import { database } from '../../database/index.js';
import { redis } from '../../lib/redis.js';
import { BotLogger } from '../../lib/logger.js';

const command: Command = {
  name: 'restart',
  aliases: ['reboot'],
  description: 'Restart the bot completely (Owner only)',
  category: 'admin',
  usage: 'restart',
  examples: ['restart'],
  ownerOnly: true,
  cooldown: 30000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    
    await reply(`╭─────────────────╮
│ 🔄 RESTARTING
╰─────────────────╯
⚠️ Initiating restart...
💾 Saving all data...
🔌 Closing connections...

Bot will restart in 3s...`);
    
    BotLogger.info('Bot restart initiated by owner');
    
    setTimeout(async () => {
      try {
        console.log('═══════════════════════ RESTART INITIATED ═══════════════════════');
        console.log('  [STATUS]          Restart command executed');
        
        await redis.disconnect();
        console.log('  [REDIS]           Disconnected');
        
        await database.disconnect();
        console.log('  [MONGODB]         Disconnected');
        
        console.log('  [STATUS]          Exiting for restart...');
        console.log('═════════════════════════════════════════════════════════════════');
        
        process.exit(0);
      } catch (e) {
        console.log('  [ERROR]           Restart error, forcing exit');
        process.exit(1);
      }
    }, 3000);
  }
};

export default command;
