import type { Command } from '../../types/index.js';

const messages = [
  '🍀 GOOD LUCK {target}! You\'ve got this! 💪',
  '⭐ Best of luck {target}! 🍀',
  '🌟 Wishing you all the luck {target}! ✨',
  '💫 Good luck {target}! Kaya mo yan! 🍀',
  '🔥 Go crush it {target}! Good luck! 💪',
];

export const command: Command = {
  name: 'goodluck',
  aliases: ['gl', 'luck'],
  description: 'Wish someone good luck',
  category: 'social',
  usage: 'goodluck @mention',
  examples: ['goodluck @John'],
  cooldown: 5000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'you';
    const msg = messages[Math.floor(Math.random() * messages.length)].replace('{target}', target as string);
    await reply(msg);
  },
};
