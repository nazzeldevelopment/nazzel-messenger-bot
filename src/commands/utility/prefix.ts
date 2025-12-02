import type { Command, CommandContext } from '../../types/index.js';
import config from '../../../config.json' with { type: 'json' };

const command: Command = {
  name: 'prefix',
  aliases: ['px'],
  description: 'Show or change the bot prefix',
  category: 'utility',
  usage: 'prefix [new_prefix]',
  examples: ['prefix', 'prefix !'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;
    
    if (args.length === 0) {
      await reply(`📌 Current prefix: ${config.bot.prefix}\n\nExample: ${config.bot.prefix}help`);
      return;
    }
    
    await reply(`⚠️ Prefix change is disabled for security.\nCurrent prefix: ${config.bot.prefix}`);
  }
};

export default command;
