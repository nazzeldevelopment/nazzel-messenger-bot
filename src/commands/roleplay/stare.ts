import type { Command } from '../../types/index.js';

const messages = [
  '*stares at {target} intensely* 👁️👁️',
  '*staring contest with {target}* 👀',
  '*creepy stare at {target}* 😐',
  '*unblinking stare at {target}* 🔍',
  '*judging stare at {target}* 🧐'
];

export const command: Command = {
  name: 'stare',
  aliases: ['look', 'titig'],
  description: 'Stare at someone',
  category: 'roleplay',
  usage: 'stare @mention',
  examples: ['stare @John'],
  cooldown: 3000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'into the void';
    const msg = messages[Math.floor(Math.random() * messages.length)].replace('{target}', target as string);
    await reply(msg);
  },
};
