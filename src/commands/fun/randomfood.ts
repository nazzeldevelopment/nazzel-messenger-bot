import type { Command } from '../../types/index.js';
const foods = ['🍕 Pizza', '🍔 Burger', '🍜 Ramen', '🍣 Sushi', '🌮 Tacos', '🍝 Pasta', '🥗 Salad', '🍛 Curry'];
export const command: Command = { name: 'randomfood', aliases: ['food'], description: 'Random food suggestion', category: 'fun', usage: 'randomfood', examples: ['randomfood'], cooldown: 3000,
  async execute({ reply }) { await reply(`🍽️ Eat: ${foods[Math.floor(Math.random() * foods.length)]}`); },
};
