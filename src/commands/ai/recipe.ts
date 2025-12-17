import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'recipe',
  aliases: ['cook', 'lutuin'],
  description: 'Get a recipe suggestion',
  category: 'ai',
  usage: 'recipe <dish>',
  examples: ['recipe adobo'],
  cooldown: 5000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ What dish would you like to cook?');
    const dish = args.join(' ');
    await reply(`👨‍🍳 RECIPE: ${dish.toUpperCase()}\n\n📝 Ingredients:\n• Main ingredients\n• Seasonings\n• Love ❤️\n\n📖 Instructions:\n1. Prepare ingredients\n2. Cook with care\n3. Serve with love\n\n🍽️ Enjoy your meal!`);
  },
};
