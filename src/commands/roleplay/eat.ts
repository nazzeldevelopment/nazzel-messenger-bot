import type { Command } from '../../types/index.js';

const foods = ['🍕 pizza', '🍔 burger', '🍜 noodles', '🍣 sushi', '🍰 cake', '🍦 ice cream', '🌮 tacos', '🍝 pasta'];

export const command: Command = {
  name: 'eat', aliases: ['eating', 'kain'], description: 'Eating expression', category: 'roleplay',
  usage: 'eat [food]', examples: ['eat', 'eat pizza'], cooldown: 3000,
  async execute({ reply, args }) {
    const food = args.length > 0 ? args.join(' ') : foods[Math.floor(Math.random() * foods.length)];
    await reply(`🍽️ *eating ${food}* nom nom nom 😋`);
  },
};
