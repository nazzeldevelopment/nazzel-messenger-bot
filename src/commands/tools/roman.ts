import type { Command } from '../../types/index.js';
export const command: Command = { name: 'roman', aliases: ['toroman'], description: 'Convert to Roman numerals', category: 'tools', usage: 'roman <number>', examples: ['roman 2024'], cooldown: 3000,
  async execute({ reply, args }) { if (!args.length) return reply('❌ Provide a number!'); const num = parseInt(args[0]); if (num < 1 || num > 3999) return reply('❌ Number must be 1-3999'); const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]; const roms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']; let result = ''; let n = num; for (let i = 0; i < vals.length; i++) { while (n >= vals[i]) { result += roms[i]; n -= vals[i]; } } await reply(`🔢 ${num} = ${result}`); },
};
