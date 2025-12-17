import type { Command } from '../../types/index.js';
const animes = ['Attack on Titan', 'Demon Slayer', 'One Piece', 'Naruto', 'My Hero Academia', 'Jujutsu Kaisen', 'Death Note', 'Fullmetal Alchemist'];
export const command: Command = { name: 'randomanime', aliases: ['animerecommend'], description: 'Random anime recommendation', category: 'fun', usage: 'randomanime', examples: ['randomanime'], cooldown: 5000,
  async execute({ reply }) { await reply(`📺 Watch: ${animes[Math.floor(Math.random() * animes.length)]}`); },
};
