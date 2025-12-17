import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'rot13',
  aliases: ['cipher'],
  description: 'Encode/decode ROT13',
  category: 'utility',
  usage: 'rot13 <text>',
  examples: ['rot13 hello'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Provide text!');
    const text = args.join(' ');
    const result = text.replace(/[a-zA-Z]/g, c => {
      const base = c <= 'Z' ? 65 : 97;
      return String.fromCharCode((c.charCodeAt(0) - base + 13) % 26 + base);
    });
    await reply(`🔐 ROT13\n\n${result}`);
  },
};
