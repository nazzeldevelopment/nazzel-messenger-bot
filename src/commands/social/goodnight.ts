import type { Command } from '../../types/index.js';

const greetings = [
  '🌙 Good night! Sweet dreams! 💤',
  '🌟 Good night! Sleep well! ✨',
  '🌜 Nighty night! 🌛',
  '🌃 Good night! See you tomorrow! 😴',
  '💫 Good night! Rest well! 🌙',
];

export const command: Command = {
  name: 'goodnight',
  aliases: ['gn', 'night', 'magandanggabi'],
  description: 'Send a good night greeting',
  category: 'social',
  usage: 'goodnight',
  examples: ['goodnight'],
  cooldown: 10000,
  async execute({ reply }) {
    await reply(greetings[Math.floor(Math.random() * greetings.length)]);
  },
};
