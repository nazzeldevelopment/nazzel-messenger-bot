import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'mock',
  aliases: ['spongebob', 'mocktext'],
  description: 'Convert text to mocking SpongeBob style',
  category: 'fun',
  usage: 'mock <text>',
  examples: ['mock i love this'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;

    if (args.length === 0) {
      await reply('🧽 Usage: N!mock <text>\n\nExample: N!mock i love this');
      return;
    }

    const text = args.join(' ');
    let mocked = '';

    for (let i = 0; i < text.length; i++) {
      if (Math.random() > 0.5) {
        mocked += text[i].toUpperCase();
      } else {
        mocked += text[i].toLowerCase();
      }
    }

    await reply(`🧽 MoCkEd TeXt:\n\n${mocked}`);
  }
};

export default command;
