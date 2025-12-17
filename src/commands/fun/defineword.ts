import type { Command } from '../../types/index.js';
export const command: Command = { name: 'defineword', aliases: ['dictionary'], description: 'Define a word', category: 'fun', usage: 'defineword <word>', examples: ['defineword love'], cooldown: 3000,
  async execute({ reply, args }) { if (!args.length) return reply('❌ Provide a word!'); await reply(`📖 Definition of "${args[0]}": This feature needs API integration!`); },
};
