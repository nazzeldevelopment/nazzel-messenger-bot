import type { Command } from '../../types/index.js';

const messages = [
  '*dances with {target}* 💃🕺',
  '*grabs {target} for a dance* Let\'s go! 🎵',
  '*busts out moves with {target}* 🔥',
  '*does a funky dance with {target}* 🕺',
  '*dances energetically with {target}* 💫'
];

export const command: Command = {
  name: 'dance',
  aliases: ['sayaw', 'boogie'],
  description: 'Dance with someone',
  category: 'roleplay',
  usage: 'dance @mention',
  examples: ['dance @John'],
  cooldown: 3000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'alone';
    const msg = messages[Math.floor(Math.random() * messages.length)].replace('{target}', target as string);
    await reply(msg);
  },
};
