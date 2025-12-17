import type { Command } from '../../types/index.js';

const morseMap: { [key: string]: string } = {
  'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.', 'h': '....',
  'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.',
  'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
  'y': '-.--', 'z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', ' ': '/',
};

export const command: Command = {
  name: 'morse',
  aliases: ['morsecode'],
  description: 'Convert text to morse code',
  category: 'utility',
  usage: 'morse <text>',
  examples: ['morse hello'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Provide text!');
    const text = args.join(' ').toLowerCase();
    const result = text.split('').map(c => morseMap[c] || c).join(' ');
    await reply(`📡 MORSE CODE\n\n${result}`);
  },
};
