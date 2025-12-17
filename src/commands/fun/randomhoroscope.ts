import type { Command } from '../../types/index.js';
const signs = ['♈ Aries', '♉ Taurus', '♊ Gemini', '♋ Cancer', '♌ Leo', '♍ Virgo', '♎ Libra', '♏ Scorpio', '♐ Sagittarius', '♑ Capricorn', '♒ Aquarius', '♓ Pisces'];
const fortunes = ['Great day ahead!', 'Love is in the air!', 'Focus on work today.', 'Unexpected surprise coming!', 'Take care of your health.', 'Money luck today!'];
export const command: Command = { name: 'horoscope', aliases: ['zodiac'], description: 'Daily horoscope', category: 'fun', usage: 'horoscope <sign>', examples: ['horoscope aries'], cooldown: 60000,
  async execute({ reply, args }) { const sign = args[0] ? signs.find(s => s.toLowerCase().includes(args[0].toLowerCase())) || signs[Math.floor(Math.random() * 12)] : signs[Math.floor(Math.random() * 12)]; const fortune = fortunes[Math.floor(Math.random() * fortunes.length)]; await reply(`${sign}\n\n⭐ ${fortune}`); },
};
