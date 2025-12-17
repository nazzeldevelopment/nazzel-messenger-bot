import type { Command } from '../../types/index.js';
const cards = [{ word: 'PIZZA', taboo: ['food', 'cheese', 'Italy', 'round'] }, { word: 'BEACH', taboo: ['sand', 'ocean', 'swim', 'sun'] }, { word: 'PHONE', taboo: ['call', 'text', 'mobile', 'cell'] }];
export const command: Command = { name: 'taboo', aliases: ['taboogame'], description: 'Taboo word game', category: 'games', usage: 'taboo', examples: ['taboo'], cooldown: 15000,
  async execute({ reply }) { const card = cards[Math.floor(Math.random() * cards.length)]; await reply(`🚫 TABOO\n\nDescribe: ${card.word}\n\n❌ Don't say: ${card.taboo.join(', ')}`); },
};
