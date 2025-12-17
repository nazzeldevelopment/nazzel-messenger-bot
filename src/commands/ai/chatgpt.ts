import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'chatgpt',
  aliases: ['gpt', 'ai', 'ask'],
  description: 'Ask ChatGPT a question',
  category: 'ai',
  usage: 'chatgpt <question>',
  examples: ['chatgpt What is the meaning of life?'],
  cooldown: 5000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Please provide a question!');
    const question = args.join(' ');
    await reply(`🤖 AI Response\n\n❓ Question: ${question}\n\n💡 I\'m an AI assistant. This is a placeholder response - integrate with OpenAI API for real responses!`);
  },
};
