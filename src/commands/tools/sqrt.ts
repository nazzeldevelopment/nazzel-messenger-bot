import type { Command } from '../../types/index.js';
export const command: Command = { name: 'sqrt', aliases: ['squareroot'], description: 'Calculate square root', category: 'tools', usage: 'sqrt <number>', examples: ['sqrt 16'], cooldown: 3000,
  async execute({ reply, args }) { if (!args.length) return reply('❌ Provide a number!'); const num = parseFloat(args[0]); await reply(`√${num} = ${Math.sqrt(num).toFixed(4)}`); },
};
