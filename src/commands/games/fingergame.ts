import type { Command } from '../../types/index.js';
export const command: Command = { name: 'fingers', aliases: ['fingerguess'], description: 'Guess total fingers', category: 'games', usage: 'fingers <0-10>', examples: ['fingers 7'], cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Guess 0-10!');
    const guess = parseInt(args[0]); if (isNaN(guess) || guess < 0 || guess > 10) return reply('❌ Guess between 0-10!');
    const bot = Math.floor(Math.random() * 6); const player = Math.floor(Math.random() * 6); const total = bot + player;
    const win = guess === total;
    await reply(`✋ FINGER GAME\n\nYou: ${player} fingers\nBot: ${bot} fingers\nTotal: ${total}\n\n${win ? '🎉 You guessed correctly!' : '❌ Wrong guess!'}`);
  },
};
