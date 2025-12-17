import type { Command } from '../../types/index.js';
export const command: Command = { name: 'antonym', aliases: ['antonyms', 'opposite'], description: 'Find antonyms', category: 'fun', usage: 'antonym <word>', examples: ['antonym happy'], cooldown: 3000,
  async execute({ reply, args }) { if (!args.length) return reply('❌ Provide a word!'); await reply(`📚 Antonyms for "${args[0]}": This feature needs API integration!`); },
};
