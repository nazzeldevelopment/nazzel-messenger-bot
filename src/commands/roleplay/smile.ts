import type { Command } from '../../types/index.js';

const messages = [
  '*smiles warmly* 😊',
  '*big smile* yay! 😄',
  '*smiles brightly* ✨',
  '*happy smile* 🥰',
  '*beaming* 😁'
];

export const command: Command = {
  name: 'smile',
  aliases: ['happy', 'ngiti'],
  description: 'Smile happily',
  category: 'roleplay',
  usage: 'smile',
  examples: ['smile'],
  cooldown: 3000,
  async execute({ reply }) {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    await reply(msg);
  },
};
