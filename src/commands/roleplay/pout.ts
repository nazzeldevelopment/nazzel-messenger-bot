import type { Command } from '../../types/index.js';

const messages = [
  '*pouts* hmph! 😤',
  '*pouting cutely* meanie... 🥺',
  '*puffs cheeks* 😾',
  '*angry pout* not fair! 😠',
  '*pouty face* 💢'
];

export const command: Command = {
  name: 'pout',
  aliases: ['hmph', 'nguso'],
  description: 'Pout expression',
  category: 'roleplay',
  usage: 'pout',
  examples: ['pout'],
  cooldown: 3000,
  async execute({ reply }) {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    await reply(msg);
  },
};
