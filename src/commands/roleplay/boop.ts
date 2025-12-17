import type { Command } from '../../types/index.js';

const messages = [
  '*boops {target}\'s nose* boop! 👆',
  '*gently boops {target}* 😊',
  '*sneaky boop on {target}* hehe 🤭',
  '*boops {target} cutely* 💕',
  '*boop boop on {target}\'s snoot* ✨'
];

export const command: Command = {
  name: 'boop',
  aliases: ['noseboop'],
  description: 'Boop someone\'s nose',
  category: 'roleplay',
  usage: 'boop @mention',
  examples: ['boop @John'],
  cooldown: 3000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'themselves';
    const msg = messages[Math.floor(Math.random() * messages.length)].replace('{target}', target as string);
    await reply(msg);
  },
};
