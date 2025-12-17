import type { Command } from '../../types/index.js';
export const command: Command = { name: 'sell', aliases: ['ibenta'], description: 'Sell an item', category: 'economy', usage: 'sell <item>', examples: ['sell fish'], cooldown: 5000,
  async execute({ reply, args }) { if (!args.length) return reply('❌ What to sell?'); const item = args.join(' '); const price = Math.floor(Math.random() * 50) + 10; await reply(`💰 Sold ${item} for $${price}!`); },
};
