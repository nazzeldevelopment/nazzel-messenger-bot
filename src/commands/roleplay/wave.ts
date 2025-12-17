import type { Command } from '../../types/index.js';

const messages = [
  '*waves at {target}* Hello! 👋',
  '*waves excitedly at {target}* Hi there! ✨',
  '*gives {target} a friendly wave* 🙋',
  '*waves hello to {target}* 😊',
  '*waves at {target} enthusiastically* 👋✨'
];

export const command: Command = {
  name: 'wave',
  aliases: ['hi', 'hello', 'kumusta'],
  description: 'Wave at someone',
  category: 'roleplay',
  usage: 'wave @mention',
  examples: ['wave @John'],
  cooldown: 3000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'everyone';
    const msg = messages[Math.floor(Math.random() * messages.length)].replace('{target}', target as string);
    await reply(msg);
  },
};
