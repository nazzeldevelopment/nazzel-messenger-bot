import type { Command } from '../../types/index.js';
export const command: Command = { name: 'synonym', aliases: ['synonyms'], description: 'Find synonyms', category: 'fun', usage: 'synonym <word>', examples: ['synonym happy'], cooldown: 3000,
  async execute({ reply, args }) { if (!args.length) return reply('❌ Provide a word!'); await reply(`📚 Synonyms for "${args[0]}": This feature needs API integration!`); },
};
