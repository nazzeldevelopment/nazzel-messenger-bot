import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'underline',
  aliases: ['ul'],
  description: 'Add underline to text',
  category: 'utility',
  usage: 'underline <text>',
  examples: ['underline hello'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Provide text!');
    const text = args.join(' ');
    const result = text.split('').join('\u0332') + '\u0332';
    await reply(result);
  },
};
