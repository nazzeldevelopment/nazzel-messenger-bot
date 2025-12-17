import type { Command } from '../../types/index.js';
const colors = ['🔴 Red', '🟠 Orange', '🟡 Yellow', '🟢 Green', '🔵 Blue', '🟣 Purple'];
export const command: Command = { name: 'colorguess', aliases: ['guesscolor'], description: 'Guess the color', category: 'games', usage: 'colorguess <color>', examples: ['colorguess red'], cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Guess a color: red, orange, yellow, green, blue, purple');
    const target = colors[Math.floor(Math.random() * colors.length)];
    const guess = args[0].toLowerCase();
    const win = target.toLowerCase().includes(guess);
    await reply(`🎨 COLOR GUESS\n\nThe color was: ${target}\n\n${win ? '🎉 You guessed it!' : '❌ Wrong!'}`);
  },
};
