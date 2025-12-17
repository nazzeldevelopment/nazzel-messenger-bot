import type { Command } from '../../types/index.js';

const messages = [
  '*tickles {target}* kitikiti~ 😂',
  '*tickles {target} mercilessly* hahaha! 🤣',
  '*attacks {target} with tickles* 😆',
  '*gives {target} surprise tickles* 🤭',
  '*tickle attack on {target}!* 😹'
];

export const command: Command = {
  name: 'tickle',
  aliases: ['kiliti'],
  description: 'Tickle someone',
  category: 'roleplay',
  usage: 'tickle @mention',
  examples: ['tickle @John'],
  cooldown: 3000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'themselves';
    const msg = messages[Math.floor(Math.random() * messages.length)].replace('{target}', target as string);
    await reply(msg);
  },
};
