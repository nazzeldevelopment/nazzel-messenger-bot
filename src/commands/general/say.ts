import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'say',
  aliases: ['echo', 'repeat'],
  description: 'Make the bot say something',
  category: 'general',
  usage: 'say <message>',
  examples: ['say Hello World!', 'say How are you?'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;
    
    if (args.length === 0) {
      await reply('❌ Please provide a message to say.\nUsage: say <message>');
      return;
    }
    
    const message = args.join(' ');
    
    if (message.length > 2000) {
      await reply('❌ Message too long! Maximum 2000 characters.');
      return;
    }
    
    await reply(message);
  }
};

export default command;
