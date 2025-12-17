import type { Command } from '../../types/index.js';

const conversions: { [key: string]: number } = {
  mg: 0.000001, g: 0.001, kg: 1, lb: 0.453592, oz: 0.0283495,
};

export const command: Command = {
  name: 'weightconvert',
  aliases: ['weight', 'mass'],
  description: 'Convert weight/mass',
  category: 'tools',
  usage: 'weightconvert <value> <from> <to>',
  examples: ['weightconvert 100 lb kg'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (args.length < 3) return reply('❌ Usage: weightconvert <value> <from> <to>\nUnits: mg, g, kg, lb, oz');
    const value = parseFloat(args[0]);
    const from = args[1].toLowerCase();
    const to = args[2].toLowerCase();
    
    if (isNaN(value)) return reply('❌ Invalid value!');
    if (!conversions[from] || !conversions[to]) return reply('❌ Invalid unit! Use: mg, g, kg, lb, oz');
    
    const kg = value * conversions[from];
    const result = kg / conversions[to];
    
    await reply(`⚖️ WEIGHT CONVERSION\n\n${value} ${from} = ${result.toFixed(4)} ${to}`);
  },
};
