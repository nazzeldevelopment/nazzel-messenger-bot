import type { Command } from '../../types/index.js';

const questions = [
  'Who in this group would survive a zombie apocalypse?',
  'Who here is most likely to become famous?',
  'Who would you trust with your deepest secret?',
  'Who is the funniest person in this chat?',
  'Who would be the worst driver?',
  'Who is most likely to become a millionaire?',
  'Who gives the best advice?',
  'Who is the most likely to be late?',
  'Who would survive longest on a deserted island?',
  'Who is the best cook here?',
  'Who is most likely to go viral?',
  'Who would you want on your trivia team?',
];

export const command: Command = {
  name: 'paranoia',
  aliases: ['paranoiaq'],
  description: 'Get a paranoia question',
  category: 'fun',
  usage: 'paranoia',
  examples: ['paranoia'],
  cooldown: 5000,
  async execute({ reply }) {
    const question = questions[Math.floor(Math.random() * questions.length)];
    await reply(`👀 PARANOIA\n\n${question}\n\n(Tag someone!)`);
  },
};
