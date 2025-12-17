import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'lowercase',
  aliases: ['lower', 'small'],
  description: 'Convert text to lowercase',
  category: 'utility',
  usage: 'lowercase <text>',
  examples: ['lowercase HELLO'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Provide text to convert!');
    await reply(args.join(' ').toLowerCase());
  },
};
