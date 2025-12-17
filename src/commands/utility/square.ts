import type { Command } from '../../types/index.js';

const squareMap: { [key: string]: string } = {
  'a': '🄰', 'b': '🄱', 'c': '🄲', 'd': '🄳', 'e': '🄴', 'f': '🄵', 'g': '🄶', 'h': '🄷',
  'i': '🄸', 'j': '🄹', 'k': '🄺', 'l': '🄻', 'm': '🄼', 'n': '🄽', 'o': '🄾', 'p': '🄿',
  'q': '🅀', 'r': '🅁', 's': '🅂', 't': '🅃', 'u': '🅄', 'v': '🅅', 'w': '🅆', 'x': '🅇',
  'y': '🅈', 'z': '🅉',
};

export const command: Command = {
  name: 'square',
  aliases: ['squaretext', 'box'],
  description: 'Convert text to square letters',
  category: 'utility',
  usage: 'square <text>',
  examples: ['square hello'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Provide text!');
    const text = args.join(' ').toLowerCase();
    const result = text.split('').map(c => squareMap[c] || c).join('');
    await reply(result);
  },
};
