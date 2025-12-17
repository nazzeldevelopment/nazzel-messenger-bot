import type { Command } from '../../types/index.js';

const messages = [
  '*facepalms* 🤦',
  '*slaps forehead* bruh... 🤦‍♂️',
  '*epic facepalm* seriously?? 🤦‍♀️',
  '*facepalms hard* why... 😑',
  '*double facepalm* 🙄'
];

export const command: Command = {
  name: 'facepalm',
  aliases: ['fp', 'bruh'],
  description: 'Facepalm expression',
  category: 'roleplay',
  usage: 'facepalm',
  examples: ['facepalm'],
  cooldown: 3000,
  async execute({ reply }) {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    await reply(msg);
  },
};
