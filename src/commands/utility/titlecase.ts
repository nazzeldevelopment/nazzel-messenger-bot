import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'titlecase',
  aliases: ['title', 'capitalize', 'proper'],
  description: 'Convert text to title case',
  category: 'utility',
  usage: 'titlecase <text>',
  examples: ['titlecase hello world'],
  cooldown: 3000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length === 0) {
      await reply(`Usage: ${prefix}titlecase <text>`);
      return;
    }

    const text = args.join(' ');
    const titled = text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );

    await reply(`╭─────────────────╮
│ 📝 TITLE CASE
╰─────────────────╯

${titled}`);
  }
};

export default command;
