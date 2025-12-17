import type { Command } from '../../types/index.js';
const cats = ['Animals', 'Countries', 'Foods', 'Movies', 'Songs', 'Names', 'Colors', 'Sports'];
export const command: Command = { name: 'categories', aliases: ['scattergories'], description: 'Categories game', category: 'games', usage: 'categories', examples: ['categories'], cooldown: 10000,
  async execute({ reply }) { const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); const selected = cats.sort(() => Math.random() - 0.5).slice(0, 4); await reply(`📝 CATEGORIES\n\nLetter: ${letter}\n\n${selected.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\n⏱️ 30 seconds!`); },
};
