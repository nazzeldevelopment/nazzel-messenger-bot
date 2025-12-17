import type { Command } from '../../types/index.js';
const animals = ['🐀 Rat', '🐂 Ox', '🐅 Tiger', '🐇 Rabbit', '🐉 Dragon', '🐍 Snake', '🐴 Horse', '🐐 Goat', '🐒 Monkey', '🐓 Rooster', '🐕 Dog', '🐖 Pig'];
export const command: Command = { name: 'chinesehoroscope', aliases: ['chinesezodiac'], description: 'Chinese zodiac', category: 'fun', usage: 'chinesehoroscope <year>', examples: ['chinesehoroscope 2000'], cooldown: 5000,
  async execute({ reply, args }) { const year = parseInt(args[0]) || new Date().getFullYear(); const idx = (year - 4) % 12; await reply(`🏮 ${year}: ${animals[idx]}`); },
};
