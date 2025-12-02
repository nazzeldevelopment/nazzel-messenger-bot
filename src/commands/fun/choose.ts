import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'choose',
  aliases: ['pick', 'random'],
  description: 'Choose randomly between options',
  category: 'fun',
  usage: 'choose <option1> | <option2> | ...',
  examples: ['choose pizza | burger | sushi'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;
    
    const input = args.join(' ');
    const options = input.split('|').map(opt => opt.trim()).filter(opt => opt.length > 0);
    
    if (options.length < 2) {
      await reply('❌ Please provide at least 2 options separated by |\nUsage: choose option1 | option2 | option3');
      return;
    }
    
    const choice = options[Math.floor(Math.random() * options.length)];
    
    await reply(`🎯 I choose: **${choice}**`);
  }
};

export default command;
