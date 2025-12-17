import type { Command } from '../../types/index.js';

const zalgoChars = ['̍', '̎', '̄', '̅', '̿', '̑', '̆', '̐', '͒', '͗', '͑', '̇', '̈', '̊', '͂', '̓', '̈́', '͊', '͋', '͌', '̃', '̂', '̌', '͐', '̀', '́', '̋', '̏', '̒', '̓', '̔', '̽', '̉', 'ͣ', 'ͤ', 'ͥ', 'ͦ', 'ͧ', 'ͨ', 'ͩ', 'ͪ', 'ͫ', 'ͬ', 'ͭ', 'ͮ', 'ͯ', '̾', '͛', '͆', '̚'];

export const command: Command = {
  name: 'zalgo',
  aliases: ['cursed', 'glitch'],
  description: 'Convert text to zalgo',
  category: 'utility',
  usage: 'zalgo <text>',
  examples: ['zalgo hello'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Provide text!');
    const text = args.join(' ');
    let result = '';
    for (const char of text) {
      result += char;
      for (let i = 0; i < 3; i++) {
        result += zalgoChars[Math.floor(Math.random() * zalgoChars.length)];
      }
    }
    await reply(result);
  },
};
