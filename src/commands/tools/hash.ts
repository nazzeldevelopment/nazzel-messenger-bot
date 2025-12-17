import type { Command } from '../../types/index.js';
import crypto from 'crypto';

export const command: Command = {
  name: 'hash',
  aliases: ['md5', 'sha256'],
  description: 'Generate hash of text',
  category: 'tools',
  usage: 'hash <text>',
  examples: ['hash hello world'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Please provide text to hash!');
    const text = args.join(' ');
    const md5 = crypto.createHash('md5').update(text).digest('hex');
    const sha256 = crypto.createHash('sha256').update(text).digest('hex');
    
    await reply(`🔐 HASH RESULTS\n\nInput: ${text}\n\nMD5: ${md5}\nSHA256: ${sha256.substring(0, 32)}...`);
  },
};
