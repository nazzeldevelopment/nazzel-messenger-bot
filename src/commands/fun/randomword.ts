import type { Command } from '../../types/index.js';
const words = ['serendipity', 'ephemeral', 'luminous', 'ethereal', 'mellifluous', 'resplendent', 'ineffable', 'quintessential'];
export const command: Command = { name: 'randomword', aliases: ['word'], description: 'Random word', category: 'fun', usage: 'randomword', examples: ['randomword'], cooldown: 3000,
  async execute({ reply }) { await reply(`📚 Word: ${words[Math.floor(Math.random() * words.length)]}`); },
};
