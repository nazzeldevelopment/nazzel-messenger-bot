import type { Command } from '../../types/index.js';
export const command: Command = { name: 'oddeven', aliases: ['oe', 'oddoreven'], description: 'Odd or Even game', category: 'games', usage: 'oddeven <odd/even>', examples: ['oddeven odd'], cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Choose: odd or even!');
    const choice = args[0].toLowerCase();
    if (choice !== 'odd' && choice !== 'even') return reply('❌ Choose: odd or even!');
    const num = Math.floor(Math.random() * 100) + 1; const isEven = num % 2 === 0;
    const win = (choice === 'even' && isEven) || (choice === 'odd' && !isEven);
    await reply(`🔢 ODD OR EVEN\n\nNumber: ${num} (${isEven ? 'EVEN' : 'ODD'})\n\n${win ? '🎉 You win!' : '❌ You lose!'}`);
  },
};
