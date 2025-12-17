import type { Command } from '../../types/index.js';

const messages = [
  '*shrugs* ¯\\_(ツ)_/¯',
  '*shrugging* idk man 🤷',
  '*big shrug* who knows? 🤷‍♂️',
  '*shrugs shoulders* meh 🤷‍♀️',
  '*casual shrug* whatever~ 😏'
];

export const command: Command = {
  name: 'shrug',
  aliases: ['idk', 'dunno'],
  description: 'Shrug expression',
  category: 'roleplay',
  usage: 'shrug',
  examples: ['shrug'],
  cooldown: 3000,
  async execute({ reply }) {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    await reply(msg);
  },
};
