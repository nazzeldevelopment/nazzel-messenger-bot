import type { Command } from '../../types/index.js';

const cheers = [
  '📣 GO {target}! YOU CAN DO IT! 💪🔥',
  '🎉 FIGHTING {target}! 화이팅! 💪',
  '⭐ YOU GOT THIS {target}! 🌟',
  '🔥 KAYA MO YAN {target}! LABAN! 💪',
  '💪 LET\'S GO {target}! WE BELIEVE IN YOU! 🎊',
];

export const command: Command = {
  name: 'cheer',
  aliases: ['support', 'fighting', 'laban'],
  description: 'Cheer for someone',
  category: 'social',
  usage: 'cheer @mention',
  examples: ['cheer @John'],
  cooldown: 5000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'everyone';
    const msg = cheers[Math.floor(Math.random() * cheers.length)].replace('{target}', target as string);
    await reply(msg);
  },
};
