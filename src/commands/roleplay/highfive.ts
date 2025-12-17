import type { Command } from '../../types/index.js';

const messages = [
  '*high fives {target}* 🙌',
  '*gives {target} an epic high five* ✋',
  '*slaps hands with {target}* Yeah! 🎉',
  '*high fives {target} with enthusiasm* 💪',
  '*epic high five with {target}!* 🔥'
];

export const command: Command = {
  name: 'highfive',
  aliases: ['hf', 'h5'],
  description: 'High five someone',
  category: 'roleplay',
  usage: 'highfive @mention',
  examples: ['highfive @John'],
  cooldown: 3000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'the air';
    const msg = messages[Math.floor(Math.random() * messages.length)].replace('{target}', target as string);
    await reply(msg);
  },
};
