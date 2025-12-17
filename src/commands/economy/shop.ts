import type { Command } from '../../types/index.js';

const items = [
  { name: 'VIP Badge', price: 5000, emoji: '👑' },
  { name: 'Custom Title', price: 2000, emoji: '🏷️' },
  { name: 'Lucky Charm', price: 1000, emoji: '🍀' },
  { name: 'XP Booster', price: 3000, emoji: '⚡' },
  { name: 'Mystery Box', price: 1500, emoji: '📦' },
];

export const command: Command = {
  name: 'shop',
  aliases: ['store', 'tindahan'],
  description: 'View the shop',
  category: 'economy',
  usage: 'shop',
  examples: ['shop'],
  cooldown: 5000,
  async execute({ reply }) {
    let shopMsg = '🏪 SHOP\n\n';
    items.forEach((item, i) => {
      shopMsg += `${item.emoji} ${item.name} - ${item.price} coins\n`;
    });
    shopMsg += '\n💡 Use: buy <item name>';
    await reply(shopMsg);
  },
};
