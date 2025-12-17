import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'strikethrough',
  aliases: ['strike', 'cross'],
  description: 'Add strikethrough to text',
  category: 'utility',
  usage: 'strikethrough <text>',
  examples: ['strikethrough hello'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Provide text!');
    const text = args.join(' ');
    const result = text.split('').join('\u0336') + '\u0336';
    await reply(result);
  },
};
