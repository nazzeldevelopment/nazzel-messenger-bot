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
      level: '🏆', utility: '🔧', economy: '💰'
    };
    
    if (args.length === 0) {
      const categories = commandHandler.getCategories();
      const totalCommands = commandHandler.getAllCommands().size;
      
      let help = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   📖 ${config.bot.name.toUpperCase()} 📖   ┃
┃        v${config.bot.version}              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌─────────────────────────────┐
│ 📌 Prefix: ${prefix}
│ 📊 Total: ${totalCommands} commands
└─────────────────────────────┘

┌── 📂 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝗶𝗲𝘀 ──┐\n`;

      for (const category of categories) {
        const count = commandHandler.getCommandsByCategory(category).length;
        const emoji = categoryEmojis[category] || '📁';
        help += `│ ${emoji} ${category.charAt(0).toUpperCase() + category.slice(1)} (${count})\n`;
      }

      help += `└────────────────────┘

┌── 𝗛𝗼𝘄 𝘁𝗼 𝗨𝘀𝗲 ──┐
│ ${prefix}help <category>
│ ${prefix}help <command>
└────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Example: ${prefix}help fun`;

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
      
      let help = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   ${emoji} ${categoryName.toUpperCase()} COMMANDS ${emoji}   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌─────────────────────────────┐\n`;

      for (const cmd of pageCommands) {
        const cmdAliases = cmd.aliases?.length ? ` (${cmd.aliases[0]})` : '';
        help += `│ ➤ ${prefix}${cmd.name}${cmdAliases}\n`;
      }

      help += `└─────────────────────────────┘

┌─────────────────────────────┐
│ 📄 Page ${currentPage}/${totalPages} │ ${commands.length} commands
└─────────────────────────────┘`;
      
      if (totalPages > 1) {
        help += `\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
        if (currentPage < totalPages) {
          help += `\n➤ Next: ${prefix}help ${firstArg} ${currentPage + 1}`;
        }
        if (currentPage > 1) {
          help += `\n➤ Prev: ${prefix}help ${firstArg} ${currentPage - 1}`;
        }
      }

      await reply(help);
      return;
    }

    const cmd = commandHandler.getCommand(firstArg);
    if (cmd) {
      const emoji = categoryEmojis[cmd.category] || '📋';
      const cooldownSec = (cmd.cooldown || 5000) / 1000;
      
      let help = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   📖 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗜𝗡𝗙𝗢 📖   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌─────────────────────────────┐
│ 📌 Name: ${cmd.name}
│ ${emoji} Category: ${cmd.category}
│ ⏱️ Cooldown: ${cooldownSec}s
└─────────────────────────────┘

┌── 📝 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻 ──┐
│ ${cmd.description}
└─────────────────────────────┘`;

      if (cmd.aliases?.length) {
        help += `

┌── 🏷️ 𝗔𝗹𝗶𝗮𝘀𝗲𝘀 ──┐
│ ${cmd.aliases.join(', ')}
└─────────────────┘`;
      }

      help += `

┌── ✏️ 𝗨𝘀𝗮𝗴𝗲 ──┐
│ ${prefix}${cmd.usage || cmd.name}
└─────────────────┘`;

      if (cmd.examples?.length) {
        help += `

┌── 💡 𝗘𝘅𝗮𝗺𝗽𝗹𝗲𝘀 ──┐`;
        for (const ex of cmd.examples.slice(0, 3)) {
          help += `\n│ ${prefix}${ex}`;
        }
        help += `
└─────────────────┘`;
      }

      if (cmd.adminOnly || cmd.ownerOnly) {
        help += `

┌── 🔒 𝗣𝗲𝗿𝗺𝗶𝘀𝘀𝗶𝗼𝗻𝘀 ──┐`;
        if (cmd.adminOnly) help += `\n│ 🔐 Admin Only`;
        if (cmd.ownerOnly) help += `\n│ 👑 Owner Only`;
        help += `
└─────────────────────┘`;
      }

      await reply(help);
      return;
    }

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ❌ 𝗡𝗢𝗧 𝗙𝗢𝗨𝗡𝗗 ❌     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ Command or category "${firstArg}" not found.

┌── 𝗧𝗿𝘆 ──┐
│ ${prefix}help ➜ All categories
│ ${prefix}help fun ➜ Fun commands
└──────────────────────────┘`);
  }
};

export default command;
