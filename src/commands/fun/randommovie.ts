import type { Command } from '../../types/index.js';
const movies = ['Inception', 'The Matrix', 'Interstellar', 'Avatar', 'Titanic', 'The Dark Knight', 'Avengers', 'Jurassic Park'];
export const command: Command = { name: 'randommovie', aliases: ['movierecommend'], description: 'Random movie recommendation', category: 'fun', usage: 'randommovie', examples: ['randommovie'], cooldown: 5000,
  async execute({ reply }) { await reply(`🎬 Watch: ${movies[Math.floor(Math.random() * movies.length)]}`); },
};
