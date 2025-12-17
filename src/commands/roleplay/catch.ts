import type { Command } from '../../types/index.js';
const catches = ['*catches it perfectly!* 🙌', '*fumbles but catches!* 😅', '*misses completely!* 😱', '*one-handed catch!* 💪', '*catches with style!* ✨'];
export const command: Command = { name: 'catch', aliases: ['saluhin'], description: 'Catch something', category: 'roleplay', usage: 'catch', examples: ['catch'], cooldown: 3000,
  async execute({ reply }) { await reply(catches[Math.floor(Math.random() * catches.length)]); },
};
