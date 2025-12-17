import type { Command } from '../../types/index.js';

const topics = [
  'If you could have any superpower, what would it be?',
  'What\'s your most embarrassing moment?',
  'If you won the lottery, what\'s the first thing you\'d buy?',
  'What\'s your biggest fear?',
  'If you could travel anywhere, where would you go?',
  'What\'s your favorite childhood memory?',
  'If you could meet any celebrity, who would it be?',
  'What\'s the weirdest food you\'ve ever eaten?',
  'What would you do if you were invisible for a day?',
  'What\'s your guilty pleasure?',
  'If you could live in any movie, which one?',
  'What\'s the best advice you\'ve ever received?',
];

export const command: Command = {
  name: 'topic',
  aliases: ['conversation', 'discuss'],
  description: 'Get a random conversation topic',
  category: 'fun',
  usage: 'topic',
  examples: ['topic'],
  cooldown: 5000,
  async execute({ reply }) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    await reply(`💬 CONVERSATION TOPIC\n\n${topic}`);
  },
};
