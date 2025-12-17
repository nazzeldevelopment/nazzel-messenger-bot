import type { Command } from '../../types/index.js';

const loves = ['❤️ *heart eyes* 😍', '💕 *in love* ✨', '💖 *blushing with love* 🥰', '💘 *cupid struck* 💗', '💞 *floating on cloud nine* ☁️'];

export const command: Command = {
  name: 'inlove', aliases: ['love', 'mahal'], description: 'In love expression', category: 'roleplay',
  usage: 'inlove', examples: ['inlove'], cooldown: 3000,
  async execute({ reply }) { await reply(loves[Math.floor(Math.random() * loves.length)]); },
};
