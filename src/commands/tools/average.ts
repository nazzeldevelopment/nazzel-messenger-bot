import type { Command } from '../../types/index.js';
export const command: Command = { name: 'average', aliases: ['avg', 'mean'], description: 'Calculate average', category: 'tools', usage: 'average <numbers...>', examples: ['average 10 20 30'], cooldown: 3000,
  async execute({ reply, args }) { if (!args.length) return reply('❌ Provide numbers!'); const nums = args.map(Number).filter(n => !isNaN(n)); const avg = (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(2); await reply(`📊 Average: ${avg}`); },
};
