import type { Command } from '../../types/index.js';

const signs: Record<string, { emoji: string; dates: string }> = {
  aries: { emoji: '♈', dates: 'Mar 21 - Apr 19' },
  taurus: { emoji: '♉', dates: 'Apr 20 - May 20' },
  gemini: { emoji: '♊', dates: 'May 21 - Jun 20' },
  cancer: { emoji: '♋', dates: 'Jun 21 - Jul 22' },
  leo: { emoji: '♌', dates: 'Jul 23 - Aug 22' },
  virgo: { emoji: '♍', dates: 'Aug 23 - Sep 22' },
  libra: { emoji: '♎', dates: 'Sep 23 - Oct 22' },
  scorpio: { emoji: '♏', dates: 'Oct 23 - Nov 21' },
  sagittarius: { emoji: '♐', dates: 'Nov 22 - Dec 21' },
  capricorn: { emoji: '♑', dates: 'Dec 22 - Jan 19' },
  aquarius: { emoji: '♒', dates: 'Jan 20 - Feb 18' },
  pisces: { emoji: '♓', dates: 'Feb 19 - Mar 20' },
};

const fortunes = [
  "Today brings unexpected opportunities. Stay alert and ready!",
  "A challenging situation will reveal your true strength.",
  "Love is in the air! Open your heart to new connections.",
  "Financial success is on the horizon. Trust your instincts.",
  "Take time for self-care. Your well-being matters most.",
  "A long-awaited message will arrive soon.",
  "Your creativity will lead to exciting breakthroughs.",
  "Trust the process. Everything is falling into place.",
  "An old friend may reach out with surprising news.",
  "Today is perfect for starting new projects.",
  "Your patience will be rewarded handsomely.",
  "Adventure awaits! Say yes to new experiences.",
  "Focus on your goals. Success is closer than you think.",
  "Someone close needs your support. Be there for them.",
  "Good karma is coming your way!",
];

const luckyNumbers = () => {
  const nums: number[] = [];
  while (nums.length < 3) {
    const n = Math.floor(Math.random() * 50) + 1;
    if (!nums.includes(n)) nums.push(n);
  }
  return nums.sort((a, b) => a - b).join(', ');
};

const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Gold', 'Silver', 'White'];

export const command: Command = {
  name: 'horoscope',
  aliases: ['zodiac', 'sign', 'fortune'],
  description: 'Get your daily horoscope',
  category: 'fun',
  usage: 'horoscope <zodiac sign>',
  examples: ['horoscope aries', 'horoscope leo'],
  cooldown: 10,

  async execute({ args, reply }) {
    if (!args[0]) {
      let signList = '🌟 *Zodiac Signs*\n\n';
      Object.entries(signs).forEach(([name, data]) => {
        signList += `${data.emoji} ${name.charAt(0).toUpperCase() + name.slice(1)} (${data.dates})\n`;
      });
      signList += `\nUsage: horoscope <sign>`;
      await reply(signList);
      return;
    }

    const signName = args[0].toLowerCase();
    const signData = signs[signName];

    if (!signData) {
      await reply(`❌ Unknown zodiac sign! Use \`horoscope\` to see all valid signs.`);
      return;
    }

    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    const luckyColor = colors[Math.floor(Math.random() * colors.length)];
    const rating = Math.floor(Math.random() * 5) + 1;

    let message = `${signData.emoji} *${signName.charAt(0).toUpperCase() + signName.slice(1)} Horoscope*\n`;
    message += `📅 ${signData.dates}\n\n`;
    message += `✨ ${fortune}\n\n`;
    message += `🎲 Lucky Numbers: ${luckyNumbers()}\n`;
    message += `🎨 Lucky Color: ${luckyColor}\n`;
    message += `⭐ Rating: ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`;

    await reply(message);
  },
};
