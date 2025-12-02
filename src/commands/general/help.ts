import type { Command, CommandContext } from '../../types/index.js';
import { commandHandler } from '../../lib/commandHandler.js';

const command: Command = {
  name: 'help',
  aliases: ['h', 'cmds', 'commands'],
  description: 'Show all commands or help for a specific command/category',
  category: 'general',
  usage: 'help [category|command] [page]',
  examples: ['help', 'help music', 'help admin 2', 'help ping'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;
    
    if (args.length === 0) {
      const mainHelp = commandHandler.generateMainHelp();
      await reply(mainHelp);
      return;
    }

    const firstArg = args[0].toLowerCase();
    const categories = commandHandler.getCategories();
    
    if (categories.includes(firstArg)) {
      const page = parseInt(args[1]) || 1;
      const categoryHelp = commandHandler.generateHelpPage(firstArg, page);
      await reply(categoryHelp);
      return;
    }

    const commandHelp = commandHandler.generateCommandHelp(firstArg);
    if (commandHelp) {
      await reply(commandHelp);
      return;
    }

    await reply(`❓ No command or category found: "${firstArg}"\nUse ${context.prefix}help to see all categories.`);
  }
};

export default command;
