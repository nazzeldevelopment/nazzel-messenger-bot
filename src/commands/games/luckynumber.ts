import type { Command } from '../../types/index.js';

const luckyMeanings = [
  'Great fortune awaits!', 'Love is in the air!', 'Success is coming!',
  'New opportunities ahead!', 'Good health and happiness!', 'Wealth is near!',
  'Adventure awaits!', 'Friends will help you!', 'Dreams will come true!',
];

export const command: Command = {
  name: 'luckynumber',
  aliases: ['luckynum', 'mylucky'],
  description: 'Get your lucky numbers',
  category: 'games',
  usage: 'luckynumber',
  examples: ['luckynumber'],
  cooldown: 5000,
  async execute({ reply, event }) {
    const seed = parseInt(event.senderID.slice(-6)) + new Date().getDate();
    const lucky1 = (seed % 49) + 1;
    const lucky2 = ((seed * 3) % 49) + 1;
    const lucky3 = ((seed * 7) % 49) + 1;
    
    const meaning = luckyMeanings[Math.floor(Math.random() * luckyMeanings.length)];
    
    await reply(`🍀 YOUR LUCKY NUMBERS\n\n${lucky1} - ${lucky2} - ${lucky3}\n\n✨ ${meaning}`);
  },
};
