import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';
import { redis } from '../../lib/redis.js';
import { BotLogger } from '../../lib/logger.js';

const command: Command = {
  name: 'restart',
  aliases: ['reboot'],
  description: 'Restart the bot completely - works on any hosting (Owner only)',
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

🌐 Works on: Koyeb, Railway,
   Heroku, Replit, Local, etc.

Bot will restart in 3s...`);
    
    BotLogger.info('Bot restart initiated by owner');
    
    setTimeout(async () => {
      try {
        console.log('═══════════════════════ RESTART INITIATED ═══════════════════════');
        console.log('  [STATUS]          Restart command executed');
        console.log('  [HOSTING]         Platform will auto-restart the bot');
        
        // Clear any shutdown flag so bot can start
        try {
          await database.setSetting('bot_shutdown', false);
          console.log('  [FLAG]            Shutdown flag cleared');
        } catch (e) {
          // Ignore if setting doesn't exist
        }
        
        await redis.disconnect();
        console.log('  [REDIS]           Disconnected');
        
        await database.disconnect();
        console.log('  [MONGODB]         Disconnected');
        
        console.log('  [STATUS]          Exiting with code 0 (clean exit)');
        console.log('  [EXPECTED]        Hosting platform will auto-restart');
        console.log('═════════════════════════════════════════════════════════════════');
        
        // Exit code 0 = clean exit, hosting platforms will auto-restart
        process.exit(0);
      } catch (e) {
        console.log('  [ERROR]           Restart error, forcing exit');
        process.exit(1);
      }
    }, 3000);
  }
};

export default command;
