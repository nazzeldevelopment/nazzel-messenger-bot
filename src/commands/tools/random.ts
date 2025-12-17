import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'random',
  aliases: ['rand', 'rng'],
  description: 'Generate a random number',
  category: 'tools',
  usage: 'random [min] [max]',
  examples: ['random', 'random 1 100'],
  cooldown: 3000,
  async execute({ reply, args }) {
    let min = 1;
    let max = 100;
    
    if (args.length >= 2) {
      min = parseInt(args[0]);
      max = parseInt(args[1]);
    } else if (args.length === 1) {
      max = parseInt(args[0]);
    }
    
    if (isNaN(min) || isNaN(max)) return reply('❌ Invalid numbers!');
    if (min > max) [min, max] = [max, min];
    
    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    
    await reply(`🎲 RANDOM NUMBER\n\nRange: ${min} - ${max}\n\n🔢 Result: ${result}`);
  },
};
