import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'countdown',
  aliases: ['timer', 'cd'],
  description: 'Start a countdown timer',
  category: 'utility',
  usage: 'countdown <seconds>',
  examples: ['countdown 10', 'countdown 30'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;

    if (args.length === 0) {
      await reply('⏱️ Usage: N!countdown <seconds>\n\nExample: N!countdown 10\n\nMax: 60 seconds');
      return;
    }

    const seconds = parseInt(args[0]);

    if (isNaN(seconds) || seconds < 1 || seconds > 60) {
      await reply('❌ Please enter a valid number between 1 and 60 seconds.');
      return;
    }

    await reply(`⏱️ Countdown started: ${seconds} seconds...\n\n⏳ Timer will end in ${seconds} seconds!`);
  }
};

export default command;
