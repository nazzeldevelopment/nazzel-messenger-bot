import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'reverse',
  aliases: ['backwards', 'rev'],
  description: 'Reverse text',
  category: 'fun',
  usage: 'reverse <text>',
  examples: ['reverse hello world'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;

    if (args.length === 0) {
      await reply('🔄 Usage: N!reverse <text>\n\nExample: N!reverse hello world');
      return;
    }

    const text = args.join(' ');
    const reversed = text.split('').reverse().join('');

    await reply(`🔄 Reversed:\n\n${reversed}`);
  }
};

export default command;
