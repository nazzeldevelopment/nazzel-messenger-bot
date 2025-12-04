import type { Command } from '../../types/index.js';
import { decorations } from '../../lib/messageFormatter.js';

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
  "Today brings unexpected opportunities. Stay alert!",
  "A challenging situation will reveal your strength.",
  "Love is in the air! Open your heart.",
  "Financial success is on the horizon.",
  "Take time for self-care today.",
  "A long-awaited message will arrive soon.",
  "Your creativity will lead to breakthroughs.",
  "Trust the process. Everything is falling into place.",
  "An old friend may reach out with news.",
  "Today is perfect for starting new projects.",
  "Your patience will be rewarded handsomely.",
  "Adventure awaits! Say yes to experiences.",
  "Focus on your goals. Success is close.",
  "Someone close needs your support today.",
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
  aliases: ['zodiacsign', 'sign', 'stars'],
  description: 'Get your daily horoscope',
  category: 'fun',
  usage: 'horoscope <zodiac sign>',
  examples: ['horoscope aries', 'horoscope leo'],
  cooldown: 10000,

  async execute({ args, reply, prefix }) {
    if (!args[0]) {
      let msg = `🌟 『 ZODIAC SIGNS 』 🌟
═══════════════════════════
${decorations.sparkle} Choose your sign!
═══════════════════════════\n`;
      
      Object.entries(signs).forEach(([name, data]) => {
        msg += `\n${data.emoji} ${name.charAt(0).toUpperCase() + name.slice(1)}`;
        msg += `\n   └─ ${data.dates}`;
      });
      
      msg += `\n
═══════════════════════════
💡 ${prefix}horoscope <sign>`;
      
      await reply(msg);
      return;
    }

    const signName = args[0].toLowerCase();
    const signData = signs[signName];

    if (!signData) {
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Unknown zodiac sign!

💡 Use ${prefix}horoscope to see signs`);
      return;
    }

    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    const luckyColor = colors[Math.floor(Math.random() * colors.length)];
    const rating = Math.floor(Math.random() * 5) + 1;

    await reply(`${signData.emoji} 『 ${signName.toUpperCase()} 』 ${signData.emoji}
═══════════════════════════
📅 ${signData.dates}
═══════════════════════════

◈ TODAY'S READING
═══════════════════════════
${decorations.sparkle} ${fortune}

◈ LUCKY STATS
═══════════════════════════
🎲 Numbers: ${luckyNumbers()}
🎨 Color: ${luckyColor}
⭐ Energy: ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}

═══════════════════════════
🌙 The stars have spoken!`);
  },
};
