import type { Command, CommandContext } from '../../types/index.js';
import { commandHandler } from '../../lib/commandHandler.js';
import config from '../../../config.json' with { type: 'json' };

const command: Command = {
  name: 'help',
  aliases: ['h', 'cmds', 'commands', 'menu'],
  description: 'Show all commands or help for a specific command/category',
  category: 'general',
  usage: 'help [category|command] [page]',
  examples: ['help', 'help fun', 'help admin 2', 'help ping'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;
    const prefix = context.prefix;
    
    const categoryEmojis: Record<string, string> = {
      admin: '⚡', fun: '🎮', general: '📚', 
      level: '🏆', utility: '🔧', economy: '💰', music: '🎵'
    };
    
    if (args.length === 0) {
      const categories = commandHandler.getCategories();
      const totalCommands = commandHandler.getAllCommands().size;
      
      let help = `╭─────────────────╮
│  📖 ${config.bot.name} v${config.bot.version}
│  Prefix: ${prefix}
│  ${totalCommands} Commands
╰─────────────────╯\n\n`;

      help += `📂 Categories:\n`;
      for (const category of categories) {
        const count = commandHandler.getCommandsByCategory(category).length;
        const emoji = categoryEmojis[category] || '📁';
        help += `${emoji} ${category} (${count})\n`;
      }

      help += `\n💡 ${prefix}help <category>`;

      await reply(help);
      return;
    }

    const firstArg = args[0].toLowerCase();
    const categories = commandHandler.getCategories();
    
    if (categories.includes(firstArg)) {
      const page = parseInt(args[1]) || 1;
      const commands = commandHandler.getCommandsByCategory(firstArg);
      const perPage = 8;
      const totalPages = Math.ceil(commands.length / perPage);
      const currentPage = Math.min(Math.max(1, page), totalPages);
      
      const startIdx = (currentPage - 1) * perPage;
      const pageCommands = commands.slice(startIdx, startIdx + perPage);
      
      const emoji = categoryEmojis[firstArg] || '📁';
      const categoryName = firstArg.charAt(0).toUpperCase() + firstArg.slice(1);
      
      let help = `╭─────────────────╮
│ ${emoji} ${categoryName} (${commands.length})
│ Page ${currentPage}/${totalPages}
╰─────────────────╯\n\n`;

      for (const cmd of pageCommands) {
        help += `▸ ${prefix}${cmd.name}\n`;
      }

      if (totalPages > 1) {
        help += `\n📄 ${prefix}help ${firstArg} ${currentPage + 1}`;
      }

      await reply(help);
      return;
    }

    const cmd = commandHandler.getCommand(firstArg);
    if (cmd) {
      const emoji = categoryEmojis[cmd.category] || '📋';
      
      let help = `╭─────────────────╮
│ 📖 ${cmd.name}
│ ${emoji} ${cmd.category}
╰─────────────────╯

${cmd.description}

Usage: ${prefix}${cmd.usage || cmd.name}`;

      if (cmd.aliases?.length) {
        help += `\nAliases: ${cmd.aliases.join(', ')}`;
      }

      if (cmd.examples?.length) {
        help += `\n\nExamples:`;
        for (const ex of cmd.examples.slice(0, 2)) {
          help += `\n▸ ${prefix}${ex}`;
        }
      }

      await reply(help);
      return;
    }

    await reply(`❌ "${firstArg}" not found.\n\nTry: ${prefix}help`);
  }
};

export default command;
