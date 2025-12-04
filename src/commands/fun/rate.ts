import type { Command } from '../../types/index.js';
import { decorations } from '../../lib/messageFormatter.js';

export const command: Command = {
  name: 'rate',
  aliases: ['rating', 'score', 'evaluate'],
  description: 'Rate anything on a scale of 1-10',
  category: 'fun',
  usage: 'rate <thing to rate>',
  examples: ['rate my coding skills', 'rate pizza', 'rate this bot'],
  cooldown: 3000,

  async execute({ event, args, reply, prefix }) {
    if (!args.length) {
      await reply(`⭐ 『 RATE ANYTHING 』 ⭐
═══════════════════════════
${decorations.sparkle} I'll rate anything for you!
═══════════════════════════

◈ USAGE
═══════════════════════════
➤ ${prefix}rate <thing>

◈ EXAMPLES
═══════════════════════════
➤ ${prefix}rate pizza
➤ ${prefix}rate my skills
➤ ${prefix}rate this weather`);
      return;
    }

    const thing = args.join(' ');
    
    const seed = (thing.toLowerCase() + event.senderID).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const rating = (seed % 10) + 1;

    let emoji = '';
    let comment = '';
    let color = '';

    if (rating >= 9) {
      emoji = '🌟';
      color = '🟣';
      comment = 'Absolutely amazing!';
    } else if (rating >= 7) {
      emoji = '😊';
      color = '🔵';
      comment = 'Pretty great!';
    } else if (rating >= 5) {
      emoji = '🤔';
      color = '🟢';
      comment = 'It\'s okay I guess';
    } else if (rating >= 3) {
      emoji = '😐';
      color = '🟡';
      comment = 'Meh, not impressed';
    } else {
      emoji = '😬';
      color = '🔴';
      comment = 'Yikes... no comment';
    }

    const stars = '⭐'.repeat(rating) + '☆'.repeat(10 - rating);

    await reply(`${emoji} 『 RATING 』 ${emoji}
═══════════════════════════

📝 "${thing}"

═══════════════════════════
${stars}
═══════════════════════════

${color} Score: ${rating}/10
💬 ${comment}

═══════════════════════════
${decorations.sparkle} Thanks for asking!`);
  },
};
