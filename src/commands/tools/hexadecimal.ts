import type { Command } from '../../types/index.js';
export const command: Command = { name: 'hexadecimal', aliases: ['tohex', 'hexnum'], description: 'Convert to hexadecimal', category: 'tools', usage: 'hexadecimal <number>', examples: ['hexadecimal 255'], cooldown: 3000,
  async execute({ reply, args }) { if (!args.length) return reply('❌ Provide a number!'); const num = parseInt(args[0]); await reply(`🔢 ${num} = ${num.toString(16).toUpperCase()} (hex)`); },
};
