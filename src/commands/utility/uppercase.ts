import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'uppercase',
  aliases: ['upper', 'caps'],
  description: 'Convert text to uppercase',
  category: 'utility',
  usage: 'uppercase <text>',
  examples: ['uppercase hello'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Provide text to convert!');
    await reply(args.join(' ').toUpperCase());
  },
};
