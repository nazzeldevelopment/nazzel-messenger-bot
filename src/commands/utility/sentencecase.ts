import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'sentencecase',
  aliases: ['sentence', 'firstcap'],
  description: 'Convert text to sentence case',
  category: 'utility',
  usage: 'sentencecase <text>',
  examples: ['sentencecase HELLO WORLD. THIS IS A TEST.'],
  cooldown: 3000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length === 0) {
      await reply(`Usage: ${prefix}sentencecase <text>`);
      return;
    }

    const text = args.join(' ');
    const sentenced = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

    await reply(`╭─────────────────╮
│ 📄 SENTENCE CASE
╰─────────────────╯

${sentenced}`);
  }
};

export default command;
