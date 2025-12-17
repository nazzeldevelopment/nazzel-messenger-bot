import type { Command } from '../../types/index.js';
const items = ['⚔️ Sword', '🛡️ Shield', '💍 Ring', '📿 Necklace', '🎒 Backpack'];
export const command: Command = { name: 'craft', aliases: ['gawa'], description: 'Craft an item', category: 'economy', usage: 'craft', examples: ['craft'], cooldown: 30000,
  async execute({ reply }) { const item = items[Math.floor(Math.random() * items.length)]; const value = Math.floor(Math.random() * 100) + 50; await reply(`🔨 CRAFTING\n\nCrafted: ${item}\nValue: $${value}`); },
};
