import type { Command } from '../../types/index.js';
export const command: Command = { name: 'binary', aliases: ['bin', 'tobin'], description: 'Convert to binary', category: 'tools', usage: 'binary <number>', examples: ['binary 42'], cooldown: 3000,
  async execute({ reply, args }) { if (!args.length) return reply('❌ Provide a number!'); const num = parseInt(args[0]); await reply(`🔢 ${num} = ${num.toString(2)} (binary)`); },
};
