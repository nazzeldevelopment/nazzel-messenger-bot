import type { Command } from '../../types/index.js';
const prompts = ['Movie', 'Animal', 'Song', 'Celebrity', 'Food', 'Action', 'Book', 'TV Show'];
export const command: Command = { name: 'charades', aliases: ['charade'], description: 'Charades game', category: 'games', usage: 'charades', examples: ['charades'], cooldown: 10000,
  async execute({ reply }) { const cat = prompts[Math.floor(Math.random() * prompts.length)]; await reply(`🎭 CHARADES\n\nCategory: ${cat}\n\nAct it out (no talking)!`); },
};
