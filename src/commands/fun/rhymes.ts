import type { Command } from '../../types/index.js';
export const command: Command = { name: 'rhymes', aliases: ['rhyme'], description: 'Find rhymes', category: 'fun', usage: 'rhymes <word>', examples: ['rhymes cat'], cooldown: 3000,
  async execute({ reply, args }) { if (!args.length) return reply('❌ Provide a word!'); await reply(`🎤 Rhymes with "${args[0]}": This feature needs API integration!`); },
};
