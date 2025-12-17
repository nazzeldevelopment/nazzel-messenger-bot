import type { Command } from '../../types/index.js';
const crops = ['🌽 Corn', '🍅 Tomato', '🥕 Carrot', '🥔 Potato', '🍓 Strawberry'];
export const command: Command = { name: 'farm', aliases: ['harvest', 'tanim'], description: 'Farm crops', category: 'economy', usage: 'farm', examples: ['farm'], cooldown: 30000,
  async execute({ reply }) { const crop = crops[Math.floor(Math.random() * crops.length)]; const qty = Math.floor(Math.random() * 10) + 1; await reply(`🌾 FARMING\n\nHarvested: ${crop} x${qty}\nValue: $${qty * 8}`); },
};
