import type { Command } from '../../types/index.js';
const games = ['Minecraft', 'Fortnite', 'GTA V', 'Valorant', 'League of Legends', 'Genshin Impact', 'Call of Duty', 'Among Us'];
export const command: Command = { name: 'randomgame', aliases: ['gamerecommend'], description: 'Random game recommendation', category: 'fun', usage: 'randomgame', examples: ['randomgame'], cooldown: 5000,
  async execute({ reply }) { await reply(`🎮 Play: ${games[Math.floor(Math.random() * games.length)]}`); },
};
