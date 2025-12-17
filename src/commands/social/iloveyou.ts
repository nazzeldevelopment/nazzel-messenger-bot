import type { Command } from '../../types/index.js';

const messages = [
  '❤️ I love you {target}! 💕',
  '💖 {target}, mahal kita! ❤️',
  '💗 Love you so much {target}! 🥰',
  '💕 {target} is loved! ❤️✨',
  '❤️ Sending love to {target}! 💖',
];

export const command: Command = {
  name: 'iloveyou',
  aliases: ['ily', 'love', 'mahalkita'],
  description: 'Express love',
  category: 'social',
  usage: 'iloveyou @mention',
  examples: ['iloveyou @John'],
  cooldown: 5000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'everyone';
    const msg = messages[Math.floor(Math.random() * messages.length)].replace('{target}', target as string);
    await reply(msg);
  },
};
