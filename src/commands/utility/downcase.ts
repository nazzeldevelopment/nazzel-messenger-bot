import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'downcase',
  aliases: ['lower', 'lowcase', 'nocaps'],
  description: 'Convert text to lowercase',
  category: 'utility',
  usage: 'downcase <text>',
  examples: ['downcase HELLO WORLD'],
  cooldown: 3000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length === 0) {
      await reply(`Usage: ${prefix}downcase <text>`);
      return;
    }

    const text = args.join(' ');
    await reply(`╭─────────────────╮
│ 🔡 LOWERCASE
╰─────────────────╯

${text.toLowerCase()}`);
  }
};

export default command;
