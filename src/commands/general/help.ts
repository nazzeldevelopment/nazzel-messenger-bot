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
    const { args, reply, api, event } = context;
    const prefix = context.prefix;
    
    let userName = 'User';
    try {
      const userInfo = await api.getUserInfo(event.senderID);
      userName = userInfo[event.senderID]?.name?.split(' ')[0] || 'User';
    } catch (e) {}
    
    const currentTime = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    
    if (args.length === 0) {
      const categories = commandHandler.getCategories();
      const totalCommands = commandHandler.getAllCommands().size;
      
      let help = `
╔══════════════════════════════════════════════╗
║                                              ║
║      ${config.bot.name.toUpperCase()}       ║
║       Advanced Messenger Bot                 ║
║                                              ║
╠══════════════════════════════════════════════╣
║  Version: ${config.bot.version}                          ║
║  Prefix: ${prefix}                                ║
║  Total Commands: ${totalCommands}                        ║
╠══════════════════════════════════════════════╣
║                                              ║
║  Hello, ${userName}!                          ║
║  ${currentTime}                    ║
║                                              ║
╠══════════════════════════════════════════════╣
║           COMMAND CATEGORIES                ║
╠══════════════════════════════════════════════╣
║                                              ║`;

      for (const category of categories) {
        const categoryConfig = (config as any).commands.categories[category];
        const emoji = categoryConfig?.emoji || '';
        const name = categoryConfig?.name || category;
        const description = categoryConfig?.description || '';
        const count = commandHandler.getCommandsByCategory(category).length;
        
        help += `
║  ${emoji} ${name.toUpperCase().padEnd(20)} [${count}]
║     ${description}
║     ${prefix}help ${category}
║                                              ║`;
      }

      help += `
╠══════════════════════════════════════════════╣
║                 QUICK TIPS                   ║
╠══════════════════════════════════════════════╣
║                                              ║
║   ${prefix}help <category>  View commands     ║
║   ${prefix}help <command>   Command details   ║
║   ${prefix}about           About the bot      ║
║   ${prefix}ping            Check bot status   ║
║                                              ║
╠══════════════════════════════════════════════╣
║                                              ║
║   Made with love for the community          ║
║   Type ${prefix}changelog for updates         ║
║                                              ║
╚══════════════════════════════════════════════╝`;

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
      
      const categoryConfig = (config as any).commands.categories[firstArg];
      const emoji = categoryConfig?.emoji || '';
      const name = categoryConfig?.name || firstArg;
      const description = categoryConfig?.description || '';
      
      let help = `
╔══════════════════════════════════════════════╗
║                                              ║
║  ${emoji} ${name.toUpperCase()} COMMANDS                       ║
║                                              ║
╠══════════════════════════════════════════════╣
║  ${description}
║                                              ║
╠══════════════════════════════════════════════╣
║                                              ║`;

      for (const cmd of pageCommands) {
        const aliases = cmd.aliases?.length ? `[${cmd.aliases.join(', ')}]` : '';
        help += `
║  ${prefix}${cmd.name} ${aliases}
║     ${cmd.description}
║`;
      }

      help += `
╠══════════════════════════════════════════════╣
║                                              ║
║  Page ${currentPage} of ${totalPages}  |  ${commands.length} commands total  ║
║                                              ║
║  ${prefix}help ${firstArg} ${currentPage + 1}  Next page          ║
║  ${prefix}help <command>    Command details   ║
║                                              ║
╚══════════════════════════════════════════════╝`;

      await reply(help);
      return;
    }

    const cmd = commandHandler.getCommand(firstArg);
    if (cmd) {
      const categoryConfig = (config as any).commands.categories[cmd.category];
      const categoryEmoji = categoryConfig?.emoji || '';
      const categoryName = categoryConfig?.name || cmd.category;
      
      let help = `
╔══════════════════════════════════════════════╗
║                                              ║
║      COMMAND DETAILS                        ║
║                                              ║
╠══════════════════════════════════════════════╣
║                                              ║
║  Name: ${cmd.name.toUpperCase()}
║                                              ║
║  ${cmd.description}
║                                              ║
╠══════════════════════════════════════════════╣
║  INFORMATION                                ║
╠══════════════════════════════════════════════╣
║                                              ║
║  Category: ${categoryEmoji} ${categoryName}
║  Cooldown: ${(cmd.cooldown || 5000) / 1000}s`;

      if (cmd.aliases?.length) {
        help += `
║  Aliases: ${cmd.aliases.join(', ')}`;
      }

      if (cmd.adminOnly) {
        help += `
║  Permission: Admin Only`;
      }
      
      if (cmd.ownerOnly) {
        help += `
║  Permission: Owner Only`;
      }

      help += `
║                                              ║
╠══════════════════════════════════════════════╣
║  USAGE                                      ║
╠══════════════════════════════════════════════╣
║                                              ║
║  ${prefix}${cmd.usage || cmd.name}
║                                              ║`;

      if (cmd.examples?.length) {
        help += `
╠══════════════════════════════════════════════╣
║  EXAMPLES                                   ║
╠══════════════════════════════════════════════╣
║                                              ║`;
        for (const example of cmd.examples) {
          help += `
║  ${prefix}${example}`;
        }
        help += `
║                                              ║`;
      }

      help += `
╚══════════════════════════════════════════════╝`;

      await reply(help);
      return;
    }

    await reply(`
╔══════════════════════════════════════════════╗
║           COMMAND NOT FOUND                 ║
╠══════════════════════════════════════════════╣
║                                              ║
║  No command or category found: "${firstArg}"
║                                              ║
║  Try ${prefix}help to see all categories.    ║
║                                              ║
╚══════════════════════════════════════════════╝`);
  }
};

export default command;
