import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'encode',
  aliases: ['base64encode', 'b64e'],
  description: 'Encode text to Base64',
  category: 'tools',
  usage: 'encode <text>',
  examples: ['encode hello world'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Please provide text to encode!');
    const text = args.join(' ');
    const encoded = Buffer.from(text).toString('base64');
    await reply(`🔒 BASE64 ENCODED\n\nInput: ${text}\nOutput: ${encoded}`);
  },
};
