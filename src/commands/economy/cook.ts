import type { Command } from '../../types/index.js';
const dishes = ['🍕 Pizza', '🍔 Burger', '🍜 Ramen', '🍣 Sushi', '🥗 Salad', '🍰 Cake'];
export const command: Command = { name: 'cook', aliases: ['luto'], description: 'Cook a dish', category: 'economy', usage: 'cook', examples: ['cook'], cooldown: 30000,
  async execute({ reply }) { const dish = dishes[Math.floor(Math.random() * dishes.length)]; const value = Math.floor(Math.random() * 50) + 25; await reply(`👨‍🍳 COOKING\n\nMade: ${dish}\nSell value: $${value}`); },
};
