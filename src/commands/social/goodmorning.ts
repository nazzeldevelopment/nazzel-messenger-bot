import type { Command } from '../../types/index.js';

const greetings = [
  '🌅 Good morning! Rise and shine! ✨',
  '☀️ Good morning! Have a wonderful day ahead! 🌻',
  '🌄 Good morning! Make today amazing! 💪',
  '🌞 Rise and grind! Good morning! 🔥',
  '🌸 Good morning! Sending positive vibes! 💕',
];

export const command: Command = {
  name: 'goodmorning',
  aliases: ['gm', 'morning', 'magandangumaga'],
  description: 'Send a good morning greeting',
  category: 'social',
  usage: 'goodmorning',
  examples: ['goodmorning'],
  cooldown: 10000,
  async execute({ reply }) {
    await reply(greetings[Math.floor(Math.random() * greetings.length)]);
  },
};
