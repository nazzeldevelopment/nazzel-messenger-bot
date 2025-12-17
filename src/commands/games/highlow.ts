import type { Command } from '../../types/index.js';
export const command: Command = { name: 'highlow', aliases: ['hl', 'higherlow'], description: 'Higher or Lower card game', category: 'games', usage: 'highlow <higher/lower>', examples: ['highlow higher'], cooldown: 5000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Choose: higher or lower!');
    const choice = args[0].toLowerCase();
    if (choice !== 'higher' && choice !== 'lower') return reply('❌ Choose: higher or lower!');
    const first = Math.floor(Math.random() * 13) + 1; const second = Math.floor(Math.random() * 13) + 1;
    const win = (choice === 'higher' && second > first) || (choice === 'lower' && second < first) || first === second;
    await reply(`🃏 HIGH LOW\n\nFirst card: ${first}\nSecond card: ${second}\n\n${win ? '🎉 You win!' : '❌ You lose!'}`);
  },
};
