import type { Command } from '../../types/index.js';
export const command: Command = { name: 'spotdiff', aliases: ['difference'], description: 'Spot the difference', category: 'games', usage: 'spotdiff', examples: ['spotdiff'], cooldown: 10000,
  async execute({ reply }) { const base = ['🍎', '🍊', '🍋', '🍇', '🍓']; const diffIdx = Math.floor(Math.random() * 5); const diff = [...base]; diff[diffIdx] = '🍌'; await reply(`👀 SPOT THE DIFFERENCE\n\nOriginal: ${base.join('')}\nChanged: ${diff.join('')}\n\nWhich position? (1-5)`); },
};
