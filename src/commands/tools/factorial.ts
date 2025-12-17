import type { Command } from '../../types/index.js';
export const command: Command = { name: 'factorial', aliases: ['fact'], description: 'Calculate factorial', category: 'tools', usage: 'factorial <number>', examples: ['factorial 5'], cooldown: 3000,
  async execute({ reply, args }) { if (!args.length) return reply('❌ Provide a number!'); const num = parseInt(args[0]); if (num < 0 || num > 20) return reply('❌ Number must be 0-20'); let result = 1; for (let i = 2; i <= num; i++) result *= i; await reply(`${num}! = ${result}`); },
};
