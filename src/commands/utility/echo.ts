import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'echo',
  aliases: ['repeat', 'ulit'],
  description: 'Echo a message',
  category: 'utility',
  usage: 'echo <message>',
  examples: ['echo Hello World'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ What should I echo?');
    await reply(args.join(' '));
  },
};
