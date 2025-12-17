import type { Command } from '../../types/index.js';
export const command: Command = { name: 'reputation', aliases: ['rep'], description: 'View reputation', category: 'economy', usage: 'reputation', examples: ['reputation'], cooldown: 5000,
  async execute({ reply }) { const rep = Math.floor(Math.random() * 100); await reply(`⭐ REPUTATION: ${rep}\n\n${rep > 50 ? '✨ Great reputation!' : '📈 Keep improving!'}`); },
};
