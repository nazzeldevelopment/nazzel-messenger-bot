import type { Command } from '../../types/index.js';
export const command: Command = { name: 'percentage', aliases: ['percent', 'porsyento'], description: 'Calculate percentage', category: 'tools', usage: 'percentage <value> <total>', examples: ['percentage 25 100'], cooldown: 3000,
  async execute({ reply, args }) { if (args.length < 2) return reply('❌ percentage <value> <total>'); const value = parseFloat(args[0]); const total = parseFloat(args[1]); const percent = ((value / total) * 100).toFixed(2); await reply(`📊 ${value} is ${percent}% of ${total}`); },
};
