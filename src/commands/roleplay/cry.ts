import type { Command } from '../../types/index.js';

const messages = [
  '*cries* 😢',
  '*sobbing in the corner* 😭',
  '*tears streaming down* huhu 💔',
  '*ugly crying* 😿',
  '*sniffles* waaah 🥺'
];

export const command: Command = {
  name: 'cry',
  aliases: ['sob', 'iyak'],
  description: 'Express sadness',
  category: 'roleplay',
  usage: 'cry',
  examples: ['cry'],
  cooldown: 3000,
  async execute({ reply }) {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    await reply(msg);
  },
};
