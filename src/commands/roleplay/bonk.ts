import type { Command } from '../../types/index.js';

const messages = [
  '*bonks {target}* Go to horny jail! 🔨',
  '*bonks {target} with bat* BONK! 🏏',
  '*anti-horny bonk on {target}* 🔨',
  '*bonks {target}* no! 🔨',
  '*bonks {target} repeatedly* bonk bonk bonk! 🔨'
];

export const command: Command = {
  name: 'bonk',
  aliases: ['hornyjail'],
  description: 'Bonk someone',
  category: 'roleplay',
  usage: 'bonk @mention',
  examples: ['bonk @John'],
  cooldown: 3000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'themselves';
    const msg = messages[Math.floor(Math.random() * messages.length)].replace('{target}', target as string);
    await reply(msg);
  },
};
