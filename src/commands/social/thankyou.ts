import type { Command } from '../../types/index.js';

const messages = [
  '💖 Thank you so much, {target}! You\'re the best! 🙏',
  '🙏 Thanks {target}! Really appreciate it! ✨',
  '💕 Thank you {target}! You\'re amazing! 🌟',
  '🌸 Salamat {target}! Maraming salamat! 💖',
  '✨ Thanks a million, {target}! 💫',
];

export const command: Command = {
  name: 'thankyou',
  aliases: ['thanks', 'ty', 'salamat'],
  description: 'Thank someone',
  category: 'social',
  usage: 'thankyou @mention',
  examples: ['thankyou @John'],
  cooldown: 5000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'everyone';
    const msg = messages[Math.floor(Math.random() * messages.length)].replace('{target}', target as string);
    await reply(msg);
  },
};
