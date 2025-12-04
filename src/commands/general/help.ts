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
    
    if (args.length === 0) {
      const categories = commandHandler.getCategories();
      const totalCommands = commandHandler.getAllCommands().size;
      
      let help = `👑 ${config.bot.name} v${config.bot.version}
━━━━━━━━━━━━━━━
📌 Prefix: ${prefix}
📊 Commands: ${totalCommands}
━━━━━━━━━━━━━━━
◈ CATEGORIES\n`;

      const emojis: Record<string, string> = {
        admin: '🔥', fun: '💖', general: '💫', 
        level: '🏆', utility: '⚙️'
      };

      for (const category of categories) {
        const count = commandHandler.getCommandsByCategory(category).length;
        const emoji = emojis[category] || '📁';
        help += `${emoji} ${category} (${count})\n`;
      }

      help += `━━━━━━━━━━━━━━━
➤ ${prefix}help <category>
➤ ${prefix}help <command>`;

      await reply(help);
      return;
    }

    const firstArg = args[0].toLowerCase();
    const categories = commandHandler.getCategories();
    
    if (categories.includes(firstArg)) {
      const page = parseInt(args[1]) || 1;
      const commands = commandHandler.getCommandsByCategory(firstArg);
      const perPage = 10;
      const totalPages = Math.ceil(commands.length / perPage);
      const currentPage = Math.min(Math.max(1, page), totalPages);
      
      const startIdx = (currentPage - 1) * perPage;
      const pageCommands = commands.slice(startIdx, startIdx + perPage);
      
      const emojis: Record<string, string> = {
        admin: '🔥', fun: '💖', general: '💫', 
        level: '🏆', utility: '⚙️'
      };
      const emoji = emojis[firstArg] || '📁';
      
      let help = `${emoji} ${firstArg.toUpperCase()}
━━━━━━━━━━━━━━━\n`;

      for (const cmd of pageCommands) {
        help += `• ${prefix}${cmd.name}\n`;
      }

      help += `━━━━━━━━━━━━━━━
📄 ${currentPage}/${totalPages} │ ${commands.length} cmds`;
      
      if (currentPage < totalPages) {
        help += `\n➤ ${prefix}help ${firstArg} ${currentPage + 1}`;
      }

      await reply(help);
      return;
    }

    const cmd = commandHandler.getCommand(firstArg);
    if (cmd) {
      let help = `📋 ${cmd.name.toUpperCase()}
━━━━━━━━━━━━━━━
${cmd.description}
━━━━━━━━━━━━━━━
📁 ${cmd.category}
⏱️ ${(cmd.cooldown || 5000) / 1000}s`;

      if (cmd.aliases?.length) {
        help += `\n🏷️ ${cmd.aliases.join(', ')}`;
      }
      if (cmd.adminOnly) help += `\n🔐 Admin`;
      if (cmd.ownerOnly) help += `\n👑 Owner`;
      
      help += `\n━━━━━━━━━━━━━━━
➤ ${prefix}${cmd.usage || cmd.name}`;

      await reply(help);
      return;
    }

    await reply(`❌ Not found: "${firstArg}"
➤ ${prefix}help`);
  }
};

export default command;
