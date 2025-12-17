import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'spacer',
  aliases: ['space', 'aesthetic'],
  description: 'Add spaces between letters',
  category: 'utility',
  usage: 'spacer <text>',
  examples: ['spacer hello'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Provide text!');
    const text = args.join(' ');
    await reply(text.split('').join(' '));
  },
};
