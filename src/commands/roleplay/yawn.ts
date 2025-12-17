import type { Command } from '../../types/index.js';

const messages = [
  '*yawns* so sleepy... 😴',
  '*big yawn* aaahhhh 🥱',
  '*yawning* need sleep... 💤',
  '*stretches and yawns* 😪',
  '*contagious yawn* 🌙'
];

export const command: Command = {
  name: 'yawn',
  aliases: ['sleepy', 'antok'],
  description: 'Yawn sleepily',
  category: 'roleplay',
  usage: 'yawn',
  examples: ['yawn'],
  cooldown: 3000,
  async execute({ reply }) {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    await reply(msg);
  },
};
