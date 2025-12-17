import type { Command } from '../../types/index.js';

const questions = [
  'Who is most likely to become president?',
  'Who is most likely to win the lottery and lose the ticket?',
  'Who is most likely to cry during a movie?',
  'Who is most likely to eat the last slice of pizza?',
  'Who is most likely to become famous on social media?',
  'Who is most likely to forget their own birthday?',
  'Who is most likely to survive a horror movie?',
  'Who is most likely to become a superhero?',
  'Who is most likely to get married first?',
  'Who is most likely to start a business?',
  'Who is most likely to travel the world?',
  'Who is most likely to write a book?',
];

export const command: Command = {
  name: 'mostlikely',
  aliases: ['ml', 'whois'],
  description: 'Most Likely To game',
  category: 'fun',
  usage: 'mostlikely',
  examples: ['mostlikely'],
  cooldown: 5000,
  async execute({ reply }) {
    const question = questions[Math.floor(Math.random() * questions.length)];
    await reply(`🎯 MOST LIKELY TO\n\n${question}`);
  },
};
