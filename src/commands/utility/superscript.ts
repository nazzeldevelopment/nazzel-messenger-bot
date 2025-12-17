import type { Command } from '../../types/index.js';

const superMap: { [key: string]: string } = {
  'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ',
  'i': 'ⁱ', 'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ',
  'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ',
  'z': 'ᶻ', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶',
  '7': '⁷', '8': '⁸', '9': '⁹',
};

export const command: Command = {
  name: 'superscript',
  aliases: ['super', 'tiny'],
  description: 'Convert text to superscript',
  category: 'utility',
  usage: 'superscript <text>',
  examples: ['superscript hello'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Provide text!');
    const text = args.join(' ').toLowerCase();
    const result = text.split('').map(c => superMap[c] || c).join('');
    await reply(result);
  },
};
