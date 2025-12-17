import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'wordcount',
  aliases: ['wc', 'count'],
  description: 'Count words and characters',
  category: 'utility',
  usage: 'wordcount <text>',
  examples: ['wordcount Hello world'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Provide text to count!');
    const text = args.join(' ');
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    await reply(`📊 TEXT STATS\n\nWords: ${words}\nCharacters: ${chars}\nWithout spaces: ${charsNoSpace}`);
  },
};
