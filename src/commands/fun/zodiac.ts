import type { Command, CommandContext } from '../../types/index.js';

const zodiacSigns: Record<string, { symbol: string; dates: string; element: string; traits: string[] }> = {
  aries: { symbol: 'Aries', dates: 'Mar 21 - Apr 19', element: 'Fire', traits: ['Courageous', 'Determined', 'Confident', 'Enthusiastic'] },
  taurus: { symbol: 'Taurus', dates: 'Apr 20 - May 20', element: 'Earth', traits: ['Reliable', 'Patient', 'Practical', 'Devoted'] },
  gemini: { symbol: 'Gemini', dates: 'May 21 - Jun 20', element: 'Air', traits: ['Gentle', 'Affectionate', 'Curious', 'Adaptable'] },
  cancer: { symbol: 'Cancer', dates: 'Jun 21 - Jul 22', element: 'Water', traits: ['Tenacious', 'Loyal', 'Emotional', 'Sympathetic'] },
  leo: { symbol: 'Leo', dates: 'Jul 23 - Aug 22', element: 'Fire', traits: ['Creative', 'Passionate', 'Generous', 'Warm-hearted'] },
  virgo: { symbol: 'Virgo', dates: 'Aug 23 - Sep 22', element: 'Earth', traits: ['Loyal', 'Analytical', 'Kind', 'Hardworking'] },
  libra: { symbol: 'Libra', dates: 'Sep 23 - Oct 22', element: 'Air', traits: ['Cooperative', 'Diplomatic', 'Gracious', 'Fair-minded'] },
  scorpio: { symbol: 'Scorpio', dates: 'Oct 23 - Nov 21', element: 'Water', traits: ['Resourceful', 'Brave', 'Passionate', 'Stubborn'] },
  sagittarius: { symbol: 'Sagittarius', dates: 'Nov 22 - Dec 21', element: 'Fire', traits: ['Generous', 'Idealistic', 'Great sense of humor'] },
  capricorn: { symbol: 'Capricorn', dates: 'Dec 22 - Jan 19', element: 'Earth', traits: ['Responsible', 'Disciplined', 'Self-control'] },
  aquarius: { symbol: 'Aquarius', dates: 'Jan 20 - Feb 18', element: 'Air', traits: ['Progressive', 'Original', 'Independent', 'Humanitarian'] },
  pisces: { symbol: 'Pisces', dates: 'Feb 19 - Mar 20', element: 'Water', traits: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle'] },
};

const dailyFortunes = [
  "Today brings new opportunities for growth.",
  "Love is in the air - keep your heart open.",
  "Financial luck is on your side today.",
  "A surprise awaits you this afternoon.",
  "Trust your instincts - they won't lead you astray.",
  "Today is perfect for starting new projects.",
  "Someone from your past may reach out.",
  "Your creativity will shine bright today.",
  "Take time for self-care and reflection.",
  "Good news is coming your way soon.",
];

const command: Command = {
  name: 'zodiac',
  aliases: ['sign', 'starsign'],
  description: 'Get information about a zodiac sign',
  category: 'fun',
  usage: 'zodiac <sign>',
  examples: ['zodiac aries', 'zodiac leo'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;
    
    if (args.length === 0) {
      const signs = Object.keys(zodiacSigns).join(', ');
      await reply(`Please specify a zodiac sign!\nAvailable signs: ${signs}`);
      return;
    }
    
    const signName = args[0].toLowerCase();
    const sign = zodiacSigns[signName];
    
    if (!sign) {
      await reply(`Unknown zodiac sign: ${signName}\nTry: aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces`);
      return;
    }
    
    const fortune = dailyFortunes[Math.floor(Math.random() * dailyFortunes.length)];
    const luckyNumber = Math.floor(Math.random() * 99) + 1;
    const luckyColor = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'White'][Math.floor(Math.random() * 8)];
    
    await reply(`
╔══════════════════════════════════════╗
║         ZODIAC READING          ║
╠══════════════════════════════════════╣
║                                      ║
║  ${sign.symbol.toUpperCase()}
║  ${sign.dates}
║                                      ║
╠══════════════════════════════════════╣
║  ELEMENT                        ║
╠══════════════════════════════════════╣
║  ${sign.element}
║                                      ║
╠══════════════════════════════════════╣
║  KEY TRAITS                     ║
╠══════════════════════════════════════╣
${sign.traits.map(t => `║  - ${t}`).join('\n')}
║                                      ║
╠══════════════════════════════════════╣
║  TODAY'S FORTUNE                ║
╠══════════════════════════════════════╣
║  ${fortune}
║                                      ║
║  Lucky Number: ${luckyNumber}
║  Lucky Color: ${luckyColor}
║                                      ║
╚══════════════════════════════════════╝`);
  },
};

export default command;
