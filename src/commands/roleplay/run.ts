import type { Command } from '../../types/index.js';

const messages = [
  '*runs away* zoom! 🏃',
  '*sprints at full speed* gotta go fast! 💨',
  '*running intensifies* 🏃‍♂️💨',
  '*naruto runs* 🥷',
  '*dashes away* bye! 🏃‍♀️'
];

export const command: Command = {
  name: 'run',
  aliases: ['sprint', 'takbo', 'flee'],
  description: 'Run away',
  category: 'roleplay',
  usage: 'run',
  examples: ['run'],
  cooldown: 3000,
  async execute({ reply }) {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    await reply(msg);
  },
};
