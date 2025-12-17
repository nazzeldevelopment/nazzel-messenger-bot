import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'fullwidth',
  aliases: ['wide', 'vaporwave'],
  description: 'Convert text to fullwidth',
  category: 'utility',
  usage: 'fullwidth <text>',
  examples: ['fullwidth hello'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Provide text!');
    const text = args.join(' ');
    const result = text.split('').map(c => {
      const code = c.charCodeAt(0);
      if (code >= 33 && code <= 126) {
        return String.fromCharCode(code + 65248);
      }
      return c;
    }).join('');
    await reply(result);
  },
};
