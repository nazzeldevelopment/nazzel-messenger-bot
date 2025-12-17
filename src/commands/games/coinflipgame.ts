import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'coinflipgame',
  aliases: ['flipcoin', 'headsortails'],
  description: 'Flip a coin and guess',
  category: 'games',
  usage: 'coinflipgame <heads/tails>',
  examples: ['coinflipgame heads'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Guess: heads or tails!');
    const guess = args[0].toLowerCase();
    if (guess !== 'heads' && guess !== 'tails') return reply('❌ Choose heads or tails!');
    
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const emoji = result === 'heads' ? '👑' : '🦅';
    const win = guess === result;
    
    await reply(`🪙 COIN FLIP\n\n${emoji} ${result.toUpperCase()}!\n\n${win ? '🎉 You guessed correctly!' : '❌ Wrong guess!'}`);
  },
};
