import type { Command } from '../../types/index.js';

const fortunes = [
  'Great things are coming your way!', 'Today is your lucky day!', 'Love will find you soon.',
  'Success is just around the corner.', 'A surprise awaits you.', 'Trust your instincts.',
  'Good health and happiness await.', 'New opportunities are opening up.', 'Your hard work will pay off.',
  'Someone is thinking of you right now.', 'Adventure awaits!', 'Stay positive, good things are coming!'
];

export const command: Command = {
  name: 'predictor', aliases: ['prediction', 'foretell'], description: 'Get a prediction', category: 'fun',
  usage: 'predictor', examples: ['predictor'], cooldown: 10000,
  async execute({ reply }) {
    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    await reply(`🔮 PREDICTION\n\n✨ ${fortune} ✨`);
  },
};
