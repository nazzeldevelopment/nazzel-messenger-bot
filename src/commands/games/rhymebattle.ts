import type { Command } from '../../types/index.js';
const words = ['cat', 'love', 'day', 'night', 'star', 'heart', 'time', 'rain'];
export const command: Command = { name: 'rhymebattle', aliases: ['rb'], description: 'Rhyme battle', category: 'games', usage: 'rhymebattle', examples: ['rhymebattle'], cooldown: 10000,
  async execute({ reply }) { const word = words[Math.floor(Math.random() * words.length)]; await reply(`🎤 RHYME BATTLE\n\nFind words that rhyme with: "${word.toUpperCase()}"\n\nMost rhymes wins!`); },
};
