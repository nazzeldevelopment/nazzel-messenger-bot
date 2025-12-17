import type { Command } from '../../types/index.js';

const messages = [
  '*blushes intensely* 😳',
  '*face turns red* a-ah... 🥺',
  '*blushes* s-stop it... 😊',
  '*cheeks turn pink* >//< 💕',
  '*blushing hard* nyaaa~ 🙈'
];

export const command: Command = {
  name: 'blush',
  aliases: ['shy', 'hiya'],
  description: 'Blush shyly',
  category: 'roleplay',
  usage: 'blush',
  examples: ['blush'],
  cooldown: 3000,
  async execute({ reply }) {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    await reply(msg);
  },
};
