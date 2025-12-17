import type { Command } from '../../types/index.js';
const songs = ['Bohemian Rhapsody', 'Imagine', 'Hotel California', 'Billie Jean', 'Sweet Child O Mine', 'Smells Like Teen Spirit', 'Purple Rain', 'Thriller'];
export const command: Command = { name: 'randomsong', aliases: ['songrecommend'], description: 'Random song recommendation', category: 'fun', usage: 'randomsong', examples: ['randomsong'], cooldown: 5000,
  async execute({ reply }) { await reply(`🎵 Listen: ${songs[Math.floor(Math.random() * songs.length)]}`); },
};
