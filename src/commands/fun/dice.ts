import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'dice',
  aliases: ['roll', 'd'],
  description: 'Roll a dice (1-6 or custom)',
  category: 'fun',
  usage: 'dice [sides]',
  examples: ['dice', 'dice 20'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;
    
    const sides = Math.min(Math.max(parseInt(args[0]) || 6, 2), 100);
    const result = Math.floor(Math.random() * sides) + 1;
    
    const diceEmoji = sides === 6 ? ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][result - 1] : '🎲';
    
    await reply(`${diceEmoji} You rolled a **${result}** (d${sides})!`);
  }
};

export default command;
