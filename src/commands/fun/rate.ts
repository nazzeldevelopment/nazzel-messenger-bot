import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'rate',
  aliases: ['rating', 'score'],
  description: 'Rate anything on a scale of 1-10',
  category: 'fun',
  usage: 'rate <thing to rate>',
  examples: ['rate my coding skills', 'rate pizza', 'rate this bot'],
  cooldown: 3,

  async execute({ event, args, reply }) {
    if (!args.length) {
      await reply('❌ What should I rate?\n\nUsage: rate <thing to rate>');
      return;
    }

    const thing = args.join(' ');
    
    const seed = (thing.toLowerCase() + event.senderID).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const rating = (seed % 10) + 1;

    let emoji = '';
    let comment = '';

    if (rating >= 9) {
      emoji = '🌟';
      comment = 'Absolutely amazing! Chef\'s kiss!';
    } else if (rating >= 7) {
      emoji = '😊';
      comment = 'Pretty great! Would recommend!';
    } else if (rating >= 5) {
      emoji = '🤔';
      comment = 'It\'s okay, could be better.';
    } else if (rating >= 3) {
      emoji = '😐';
      comment = 'Meh, not impressed.';
    } else {
      emoji = '😬';
      comment = 'Yikes... no comment.';
    }

    const stars = '⭐'.repeat(rating) + '☆'.repeat(10 - rating);

    let message = `${emoji} *Rating*\n\n`;
    message += `📝 "${thing}"\n\n`;
    message += `${stars}\n`;
    message += `🎯 Score: ${rating}/10\n\n`;
    message += `💬 ${comment}`;

    await reply(message);
  },
};
