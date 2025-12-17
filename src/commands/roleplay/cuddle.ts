import type { Command } from '../../types/index.js';

const messages = [
  '*cuddles with {target} warmly* 🤗',
  '*wraps arms around {target}* so cozy~ 💕',
  '*snuggles up to {target}* 😊',
  '*gives {target} the warmest cuddles* ✨',
  '*cuddles {target} tightly* 💖'
];

export const command: Command = {
  name: 'cuddle',
  aliases: ['snuggle', 'yakap'],
  description: 'Cuddle with someone',
  category: 'roleplay',
  usage: 'cuddle @mention',
  examples: ['cuddle @John'],
  cooldown: 3000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'a pillow';
    const msg = messages[Math.floor(Math.random() * messages.length)].replace('{target}', target as string);
    await reply(msg);
  },
};
