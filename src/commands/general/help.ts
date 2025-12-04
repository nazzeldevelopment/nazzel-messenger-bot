import type { Command, CommandContext } from '../../types/index.js';
import { commandHandler } from '../../lib/commandHandler.js';
import config from '../../../config.json' with { type: 'json' };
import fmt, { decorations } from '../../lib/messageFormatter.js';

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
    
    const currentTime = fmt.formatTimestamp();
    
    if (args.length === 0) {
      const categories = commandHandler.getCategories();
      const totalCommands = commandHandler.getAllCommands().size;
      
      let help = `${decorations.crown} 『 ${config.bot.name.toUpperCase()} 』 ${decorations.crown}
${decorations.sparkle} Advanced Messenger Bot

━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.gem} Version: ${config.bot.version}
${decorations.lightning} Prefix: ${prefix}
${decorations.star} Commands: ${totalCommands}
━━━━━━━━━━━━━━━━━━━━━━━━━

${decorations.heart} Welcome, ${userName}!
${decorations.sun} ${currentTime}

◈ COMMAND CATEGORIES ◈
━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

      const categoryStyles = ['🔵', '🟣', '🟢', '🟡', '🟠', '🔴'];
      let colorIndex = 0;

      for (const category of categories) {
        const categoryConfig = (config as any).commands.categories[category];
        const emoji = categoryConfig?.emoji || categoryStyles[colorIndex % categoryStyles.length];
        const name = categoryConfig?.name || category;
        const description = categoryConfig?.description || '';
        const count = commandHandler.getCommandsByCategory(category).length;
        
        help += `
${emoji} ${name.toUpperCase()} 〔${count}〕
   ┗ ${description}
   ┗ ${prefix}help ${category}\n`;
        colorIndex++;
      }

      help += `
━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.lightning} QUICK COMMANDS
━━━━━━━━━━━━━━━━━━━━━━━━━
➤ ${prefix}help <category>
➤ ${prefix}help <command>
➤ ${prefix}about
➤ ${prefix}ping
━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.music} Made with ${decorations.heart} for the community
${decorations.star} Type ${prefix}changelog for updates`;

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
      const emoji = categoryConfig?.emoji || '📁';
      const name = categoryConfig?.name || firstArg;
      const description = categoryConfig?.description || '';
      
      let help = `${emoji} 『 ${name.toUpperCase()} COMMANDS 』 ${emoji}
━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.sparkle} ${description}
━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

      const bullets = ['◆', '◇', '●', '○', '▸', '▹', '★', '☆'];
      let bulletIndex = 0;

      for (const cmd of pageCommands) {
        const aliases = cmd.aliases?.length ? `[${cmd.aliases.slice(0, 2).join(', ')}]` : '';
        const bullet = bullets[bulletIndex % bullets.length];
        help += `
${bullet} ${prefix}${cmd.name} ${aliases}
   └─ ${cmd.description}\n`;
        bulletIndex++;
      }

      help += `
━━━━━━━━━━━━━━━━━━━━━━━━━
📄 Page ${currentPage}/${totalPages} │ ${commands.length} commands
━━━━━━━━━━━━━━━━━━━━━━━━━
${currentPage < totalPages ? `➤ ${prefix}help ${firstArg} ${currentPage + 1}` : '✓ Last page'}
➤ ${prefix}help <command> for details`;

      await reply(help);
      return;
    }

    const cmd = commandHandler.getCommand(firstArg);
    if (cmd) {
      const categoryConfig = (config as any).commands.categories[cmd.category];
      const categoryEmoji = categoryConfig?.emoji || '📋';
      const categoryName = categoryConfig?.name || cmd.category;
      
      let help = `${decorations.gem} 『 COMMAND INFO 』 ${decorations.gem}
━━━━━━━━━━━━━━━━━━━━━━━━━

${decorations.star} Name: ${cmd.name.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━
${cmd.description}

◈ DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━
${categoryEmoji} Category: ${categoryName}
⏱️ Cooldown: ${(cmd.cooldown || 5000) / 1000}s`;

      if (cmd.aliases?.length) {
        help += `\n🏷️ Aliases: ${cmd.aliases.join(', ')}`;
      }

      if (cmd.adminOnly) {
        help += `\n🔐 Permission: Admin Only`;
      }
      
      if (cmd.ownerOnly) {
        help += `\n👑 Permission: Owner Only`;
      }

      help += `

◈ USAGE
━━━━━━━━━━━━━━━━━━━━━━━━━
➤ ${prefix}${cmd.usage || cmd.name}`;

      if (cmd.examples?.length) {
        help += `

◈ EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━`;
        for (const example of cmd.examples) {
          help += `\n• ${prefix}${example}`;
        }
      }

      help += `
━━━━━━━━━━━━━━━━━━━━━━━━━`;

      await reply(help);
      return;
    }

    await reply(`${decorations.fire} 『 NOT FOUND 』 ${decorations.fire}
━━━━━━━━━━━━━━━━━━━━━━━━━
❌ No command/category: "${firstArg}"

➤ Try ${prefix}help to see all
━━━━━━━━━━━━━━━━━━━━━━━━━`);
  }
};

export default command;
