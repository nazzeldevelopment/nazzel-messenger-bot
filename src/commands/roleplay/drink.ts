import type { Command } from '../../types/index.js';

const drinks = ['☕ coffee', '🧋 milk tea', '🥤 soda', '🍵 tea', '🧃 juice', '🥛 milk', '🍺 beer'];

export const command: Command = {
  name: 'drink', aliases: ['drinking', 'inom'], description: 'Drinking expression', category: 'roleplay',
  usage: 'drink [drink]', examples: ['drink', 'drink coffee'], cooldown: 3000,
  async execute({ reply, args }) {
    const drink = args.length > 0 ? args.join(' ') : drinks[Math.floor(Math.random() * drinks.length)];
    await reply(`🥤 *drinking ${drink}* ahh refreshing 😌`);
  },
};
