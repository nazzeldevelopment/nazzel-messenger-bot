import type { Command } from '../../types/index.js';

const adviceList = [
  'Take things one step at a time. Progress is progress, no matter how small.',
  'Remember to take care of yourself. You can\'t pour from an empty cup.',
  'Don\'t be afraid to ask for help. Everyone needs support sometimes.',
  'Trust the process. Good things take time.',
  'Focus on what you can control and let go of what you cannot.',
  'Believe in yourself. You\'re capable of more than you know.',
  'Learn from your mistakes. They\'re stepping stones to success.',
  'Stay positive. Your attitude determines your direction.',
  'Be patient with yourself. Growth takes time.',
  'Embrace change. It\'s the only constant in life.',
];

export const command: Command = {
  name: 'advice',
  aliases: ['payo', 'wisdom'],
  description: 'Get life advice',
  category: 'ai',
  usage: 'advice',
  examples: ['advice'],
  cooldown: 5000,
  async execute({ reply }) {
    const advice = adviceList[Math.floor(Math.random() * adviceList.length)];
    await reply(`💡 ADVICE\n\n"${advice}"\n\n✨ Remember: You've got this!`);
  },
};
