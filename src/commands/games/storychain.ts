import type { Command } from '../../types/index.js';
const starters = ['Once upon a time,', 'In a land far away,', 'One dark night,', 'It all began when,', 'Long ago,'];
export const command: Command = { name: 'storychain', aliases: ['storytime'], description: 'Collaborative story', category: 'games', usage: 'storychain', examples: ['storychain'], cooldown: 5000,
  async execute({ reply }) { const start = starters[Math.floor(Math.random() * starters.length)]; await reply(`📖 STORY CHAIN\n\n${start}\n\n(Continue the story! One sentence each.)`); },
};
