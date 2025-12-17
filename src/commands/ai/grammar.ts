import type { Command } from '../../types/index.js';
export const command: Command = { name: 'grammar', aliases: ['grammarcheck', 'spellcheck'], description: 'Check grammar (placeholder)', category: 'ai', usage: 'grammar <text>', examples: ['grammar I is going to store'], cooldown: 5000,
  async execute({ reply, args }) { if (!args.length) return reply('❌ Provide text to check!'); await reply(`📝 GRAMMAR CHECK\n\nText: "${args.join(' ')}"\n\nThis requires AI API integration!`); },
};
