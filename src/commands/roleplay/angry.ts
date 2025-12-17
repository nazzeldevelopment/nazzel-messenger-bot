import type { Command } from '../../types/index.js';

const messages = [
  '*angrily stomps* grrrr! 😡',
  '*fuming* so mad right now! 💢',
  '*angry noises* 😤',
  '*rage mode activated* 🔥',
  '*sees red* aaargh! 💥'
];

export const command: Command = {
  name: 'angry',
  aliases: ['mad', 'galit', 'rage'],
  description: 'Express anger',
  category: 'roleplay',
  usage: 'angry',
  examples: ['angry'],
  cooldown: 3000,
  async execute({ reply }) {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    await reply(msg);
  },
};
