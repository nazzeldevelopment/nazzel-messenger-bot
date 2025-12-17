import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'randomcase',
  aliases: ['spongebob', 'mocktext'],
  description: 'Convert text to random case',
  category: 'utility',
  usage: 'randomcase <text>',
  examples: ['randomcase hello world'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Provide text!');
    const text = args.join(' ');
    const result = text.split('').map(c => Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()).join('');
    await reply(result);
  },
};
