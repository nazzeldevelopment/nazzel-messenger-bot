import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'binary',
  aliases: ['tobin', 'bin'],
  description: 'Convert text to binary',
  category: 'fun',
  usage: 'binary <text>',
  examples: ['binary hello'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;

    if (args.length === 0) {
      await reply('💻 Usage: N!binary <text>\n\nExample: N!binary hello');
      return;
    }

    const text = args.join(' ');
    let binary = '';

    for (let i = 0; i < text.length; i++) {
      binary += text.charCodeAt(i).toString(2).padStart(8, '0') + ' ';
    }

    await reply(`💻 Binary Output:\n\n${binary.trim()}`);
  }
};

export default command;
