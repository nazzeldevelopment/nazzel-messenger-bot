import type { Command } from '../../types/index.js';
export const command: Command = { name: 'power', aliases: ['pow', 'exponent'], description: 'Calculate power', category: 'tools', usage: 'power <base> <exponent>', examples: ['power 2 8'], cooldown: 3000,
  async execute({ reply, args }) { if (args.length < 2) return reply('❌ power <base> <exponent>'); const base = parseFloat(args[0]); const exp = parseFloat(args[1]); await reply(`${base}^${exp} = ${Math.pow(base, exp)}`); },
};
