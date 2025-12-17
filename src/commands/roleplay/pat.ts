import type { Command } from '../../types/index.js';

const messages = [
  '*pats {target} on the head gently* 🥰',
  '*gives {target} warm headpats* ✨',
  '*softly pats {target}* there there~ 💕',
  '*pats {target} with love* 😊',
  '*gives {target} the best headpats* 💫'
];

export const command: Command = {
  name: 'pat',
  aliases: ['headpat', 'pets'],
  description: 'Pat someone on the head',
  category: 'roleplay',
  usage: 'pat @mention',
  examples: ['pat @John'],
  cooldown: 3000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'themselves';
    const msg = messages[Math.floor(Math.random() * messages.length)].replace('{target}', target as string);
    await reply(msg);
  },
};
