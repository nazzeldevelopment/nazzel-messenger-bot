import type { Command } from '../../types/index.js';

const lorem = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum';

export const command: Command = {
  name: 'lorem',
  aliases: ['loremipsum', 'placeholder'],
  description: 'Generate lorem ipsum text',
  category: 'utility',
  usage: 'lorem [words]',
  examples: ['lorem', 'lorem 50'],
  cooldown: 3000,
  async execute({ reply, args }) {
    const wordCount = Math.min(parseInt(args[0]) || 30, 200);
    const words = lorem.split(' ');
    let result = '';
    for (let i = 0; i < wordCount; i++) {
      result += words[i % words.length] + ' ';
    }
    await reply(`📝 LOREM IPSUM\n\n${result.trim()}`);
  },
};
