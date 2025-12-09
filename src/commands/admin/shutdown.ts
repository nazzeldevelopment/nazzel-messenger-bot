import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';
import { redis } from '../../lib/redis.js';
import { BotLogger } from '../../lib/logger.js';

const command: Command = {
  name: 'shutdown',
  aliases: ['die', 'off'],
  description: 'Shutdown the bot completely - stays off until redeployed (Owner only)',
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

🌐 Works on: Koyeb, Railway,
   Heroku, Replit, Local, etc.

⚠️ Bot will stay OFFLINE!
📦 Need to REDEPLOY to restart

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
🚫 Setting shutdown flag...

👋 Bot going OFFLINE!
📦 Redeploy to restart.`);
    
    BotLogger.info('Bot shutdown initiated by owner - setting shutdown flag');
    
    setTimeout(async () => {
      try {
        console.log('═══════════════════════ SHUTDOWN INITIATED ═══════════════════════');
        console.log('  [STATUS]          Shutdown command executed');
        console.log('  [HOSTING]         Bot will stay offline until redeployed');
        
        // Set shutdown flag in database - bot will check this on startup
        try {
          await database.setSetting('bot_shutdown', true);
          await database.setSetting('bot_shutdown_time', new Date().toISOString());
          console.log('  [FLAG]            Shutdown flag SET in database');
          console.log('  [INFO]            Bot will refuse to start until redeployed');
        } catch (e) {
          console.log('  [WARNING]         Could not set shutdown flag');
        }
        
        await redis.disconnect();
        console.log('  [REDIS]           Disconnected');
        
        await database.disconnect();
        console.log('  [MONGODB]         Disconnected');
        
        console.log('  [STATUS]          Cleanup complete. Goodbye!');
        console.log('  [INFO]            To restart: Redeploy or set FORCE_START=true env');
        console.log('═════════════════════════════════════════════════════════════════');
        
        // Exit with code 0, but shutdown flag will prevent restart
        process.exit(0);
      } catch (e) {
        console.log('  [ERROR]           Shutdown error, forcing exit');
        process.exit(1);
      }
    }, 2000);
  }
};

export default command;
