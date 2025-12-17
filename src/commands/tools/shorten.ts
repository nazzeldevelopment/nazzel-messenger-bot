import type { Command } from '../../types/index.js';
export const command: Command = { name: 'shorten', aliases: ['shorturl', 'tinyurl'], description: 'Shorten URL (placeholder)', category: 'tools', usage: 'shorten <url>', examples: ['shorten https://example.com'], cooldown: 5000,
  async execute({ reply, args }) { if (!args.length) return reply('❌ Provide URL!'); await reply(`🔗 URL shortening requires API integration!\n\nURL: ${args[0]}`); },
};
