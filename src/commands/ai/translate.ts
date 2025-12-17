import type { Command } from '../../types/index.js';
export const command: Command = { name: 'translate', aliases: ['trans', 'salin'], description: 'Translate text (placeholder)', category: 'ai', usage: 'translate <lang> <text>', examples: ['translate filipino hello'], cooldown: 5000,
  async execute({ reply, args }) { if (args.length < 2) return reply('❌ translate <lang> <text>'); const lang = args[0]; const text = args.slice(1).join(' '); await reply(`🌐 Translate to ${lang}:\n\n"${text}"\n\nThis requires translation API integration!`); },
};
