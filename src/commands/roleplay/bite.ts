import type { Command } from '../../types/index.js';

const messages = [
  '*bites {target} playfully* 😈',
  '*chomps on {target}* nom nom 🦷',
  '*gives {target} a playful bite* 😋',
  '*nibbles on {target}* 🐾',
  '*bites {target}* rawr 🐯'
];

export const command: Command = {
  name: 'bite',
  aliases: ['chomp', 'kagat'],
  description: 'Bite someone playfully',
  category: 'roleplay',
  usage: 'bite @mention',
  examples: ['bite @John'],
  cooldown: 3000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'the air';
    const msg = messages[Math.floor(Math.random() * messages.length)].replace('{target}', target as string);
    await reply(msg);
  },
};
