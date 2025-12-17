import type { Command } from '../../types/index.js';
const emojiMap: { [key: string]: string } = { a: '🅰️', b: '🅱️', o: '⭕', p: '🅿️', ab: '🆎', sos: '🆘', vs: '🆚' };
export const command: Command = { name: 'emojify', aliases: ['textemoji'], description: 'Convert text to emoji letters', category: 'tools', usage: 'emojify <text>', examples: ['emojify hello'], cooldown: 3000,
  async execute({ reply, args }) { if (!args.length) return reply('❌ Provide text!'); const text = args.join(' ').toLowerCase(); const result = text.split('').map(c => { if (/[a-z]/.test(c)) return String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 97) + ' '; return c; }).join(''); await reply(result); },
};
