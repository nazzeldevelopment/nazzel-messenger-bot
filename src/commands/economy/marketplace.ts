import type { Command } from '../../types/index.js';
const items = [{ name: 'Fishing Rod', price: 100 }, { name: 'Pickaxe', price: 150 }, { name: 'Sword', price: 200 }, { name: 'Shield', price: 175 }, { name: 'Potion', price: 50 }];
export const command: Command = { name: 'marketplace', aliases: ['market'], description: 'View marketplace', category: 'economy', usage: 'marketplace', examples: ['marketplace'], cooldown: 5000,
  async execute({ reply }) { await reply(`🏪 MARKETPLACE\n\n${items.map(i => `• ${i.name}: $${i.price}`).join('\n')}\n\nUse: buy <item>`); },
};
