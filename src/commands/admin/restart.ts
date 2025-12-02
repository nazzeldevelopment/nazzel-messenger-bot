import type { Command, CommandContext } from '../../types/index.js';
import { commandHandler } from '../../lib/commandHandler.js';
import { BotLogger } from '../../lib/logger.js';

const command: Command = {
  name: 'restart',
  aliases: ['reload', 'reboot'],
  description: 'Soft restart the bot and reload all commands',
  category: 'admin',
  usage: 'restart',
  examples: ['restart'],
  ownerOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    
    await reply('🔄 Restarting bot and reloading commands...');
    
    try {
      await commandHandler.reloadCommands();
      
      BotLogger.info('Bot soft restarted by owner');
      
      const commandCount = commandHandler.getAllCommands().size;
      await reply(`✅ Bot restarted successfully!\n📦 Loaded ${commandCount} commands.`);
    } catch (error) {
      BotLogger.error('Failed to restart bot', error);
      await reply('❌ Failed to restart bot. Check logs for details.');
    }
  }
};

export default command;
