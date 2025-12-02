import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'coin',
  aliases: ['flip', 'coinflip'],
  description: 'Flip a coin',
  category: 'fun',
  usage: 'coin',
  examples: ['coin'],

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const emoji = result === 'Heads' ? '🪙' : '🪙';
    
    await reply(`${emoji} The coin landed on: **${result}**!`);
  }
};

export default command;
