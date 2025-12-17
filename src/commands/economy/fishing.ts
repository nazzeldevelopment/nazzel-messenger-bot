import type { Command } from '../../types/index.js';
const fish = ['🐟 Common Fish', '🐠 Tropical Fish', '🐡 Pufferfish', '🦈 Shark', '🐋 Whale', '🦐 Shrimp'];
export const command: Command = { name: 'fishing', aliases: ['pangisda'], description: 'Go fishing', category: 'economy', usage: 'fishing', examples: ['fishing'], cooldown: 30000,
  async execute({ reply }) { const caught = fish[Math.floor(Math.random() * fish.length)]; const value = Math.floor(Math.random() * 50) + 10; await reply(`🎣 FISHING\n\nYou caught: ${caught}\nValue: $${value}`); },
};
