import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'imagine',
  aliases: ['dalle', 'generateimage', 'genimg'],
  description: 'Generate an image using AI',
  category: 'ai',
  usage: 'imagine <description>',
  examples: ['imagine a cat riding a unicorn'],
  cooldown: 10000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Please describe what you want to imagine!');
    const prompt = args.join(' ');
    await reply(`🎨 Image Generation\n\n📝 Prompt: ${prompt}\n\n🖼️ This feature requires DALL-E API integration. Placeholder response.`);
  },
};
