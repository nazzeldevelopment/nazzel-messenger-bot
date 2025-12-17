import type { Command } from '../../types/index.js';
const answers = ['Yes!', 'No!', 'Maybe...', 'Definitely!', 'Ask again later', 'Absolutely not', 'Signs point to yes', 'I doubt it', 'Most likely', 'Cannot predict now'];
export const command: Command = { name: 'magic8ball', aliases: ['8ball2', 'magicball'], description: 'Magic 8 ball', category: 'fun', usage: 'magic8ball <question>', examples: ['magic8ball Will I be rich?'], cooldown: 3000,
  async execute({ reply, args }) { if (!args.length) return reply('❌ Ask a question!'); await reply(`🎱 ${answers[Math.floor(Math.random() * answers.length)]}`); },
};
