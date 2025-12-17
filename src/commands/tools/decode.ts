import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'decode',
  aliases: ['base64decode', 'b64d'],
  description: 'Decode Base64 to text',
  category: 'tools',
  usage: 'decode <base64>',
  examples: ['decode aGVsbG8gd29ybGQ='],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Please provide Base64 to decode!');
    try {
      const decoded = Buffer.from(args[0], 'base64').toString('utf-8');
      await reply(`🔓 BASE64 DECODED\n\nInput: ${args[0]}\nOutput: ${decoded}`);
    } catch {
      await reply('❌ Invalid Base64 string!');
    }
  },
};
