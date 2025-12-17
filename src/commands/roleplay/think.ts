import type { Command } from '../../types/index.js';

const thoughts = ['🤔 *thinking intensely*', '💭 *deep in thought*', '🧠 *brain loading...*', '💡 *idea forming*', '🤯 *mind blown*'];

export const command: Command = {
  name: 'think', aliases: ['thinking', 'isip'], description: 'Think expression', category: 'roleplay',
  usage: 'think', examples: ['think'], cooldown: 3000,
  async execute({ reply }) { await reply(thoughts[Math.floor(Math.random() * thoughts.length)]); },
};
