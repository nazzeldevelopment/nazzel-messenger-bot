import type { Command } from '../../types/index.js';

const leetMap: { [key: string]: string } = {
  'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5', 't': '7', 'l': '1',
  'A': '4', 'E': '3', 'I': '1', 'O': '0', 'S': '5', 'T': '7', 'L': '1',
};

export const command: Command = {
  name: 'leet',
  aliases: ['l33t', '1337'],
  description: 'Convert text to leet speak',
  category: 'utility',
  usage: 'leet <text>',
  examples: ['leet hello'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Provide text!');
    const text = args.join(' ');
    const result = text.split('').map(c => leetMap[c] || c).join('');
    await reply(result);
  },
};
