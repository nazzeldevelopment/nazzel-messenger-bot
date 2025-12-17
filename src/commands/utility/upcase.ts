import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'upcase',
  aliases: ['upper', 'caps', 'allcaps'],
  description: 'Convert text to uppercase',
  category: 'utility',
  usage: 'upcase <text>',
  examples: ['upcase hello world'],
  cooldown: 3000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length === 0) {
      await reply(`Usage: ${prefix}upcase <text>`);
      return;
    }

    const text = args.join(' ');
    await reply(`╭─────────────────╮
│ 🔠 UPPERCASE
╰─────────────────╯

${text.toUpperCase()}`);
  }
};

export default command;
