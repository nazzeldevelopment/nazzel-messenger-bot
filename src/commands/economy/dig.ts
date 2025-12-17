import type { Command } from '../../types/index.js';
const treasures = ['💎 Diamond', '🪙 Gold Coin', '📦 Treasure Box', '🦴 Fossil', '💰 Money Bag', '🗿 Artifact'];
export const command: Command = { name: 'dig', aliases: ['excavate'], description: 'Dig for treasure', category: 'economy', usage: 'dig', examples: ['dig'], cooldown: 30000,
  async execute({ reply }) { const success = Math.random() > 0.3; if (success) { const item = treasures[Math.floor(Math.random() * treasures.length)]; const value = Math.floor(Math.random() * 100) + 20; await reply(`⛏️ DIGGING\n\nYou found: ${item}\nValue: $${value}`); } else await reply('⛏️ You found nothing...'); },
};
