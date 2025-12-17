import type { Command } from '../../types/index.js';
export const command: Command = { name: 'codehelp', aliases: ['code', 'coding'], description: 'Get coding help (placeholder)', category: 'ai', usage: 'codehelp <question>', examples: ['codehelp How to make a loop in Python?'], cooldown: 10000,
  async execute({ reply, args }) { if (!args.length) return reply('❌ Ask a coding question!'); await reply(`💻 CODE HELP\n\nQuestion: ${args.join(' ')}\n\nThis requires AI API integration for real answers!`); },
};
