import type { Command } from '../../types/index.js';
const emojis = ['🎀', '🌸', '⭐', '💎'];
export const command: Command = { name: 'matchpairs', aliases: ['match'], description: 'Match pairs game', category: 'games', usage: 'matchpairs', examples: ['matchpairs'], cooldown: 10000,
  async execute({ reply }) { const pairs = [...emojis, ...emojis].sort(() => Math.random() - 0.5); const hidden = pairs.map(() => '❓'); await reply(`🎴 MATCH PAIRS\n\n${hidden.slice(0, 4).join('')}\n${hidden.slice(4).join('')}\n\nFind matching pairs! (1-8)`); },
};
