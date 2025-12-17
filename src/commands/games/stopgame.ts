import type { Command } from '../../types/index.js';
const categories = ['Animal', 'Food', 'Country', 'Movie', 'Song', 'Name', 'Color', 'Object'];
export const command: Command = { name: 'stopgame', aliases: ['stop', 'kategorya'], description: 'Categories game', category: 'games', usage: 'stopgame', examples: ['stopgame'], cooldown: 10000,
  async execute({ reply }) { const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); const cats = categories.sort(() => Math.random() - 0.5).slice(0, 5); await reply(`🛑 STOP GAME!\n\nLetter: ${letter}\n\nCategories:\n${cats.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\n⏱️ GO!`); },
};
