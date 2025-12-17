import type { Command } from '../../types/index.js';

const conversions: { [key: string]: number } = {
  mm: 0.001, cm: 0.01, m: 1, km: 1000, in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.34,
};

export const command: Command = {
  name: 'lengthconvert',
  aliases: ['length', 'distance'],
  description: 'Convert length/distance',
  category: 'tools',
  usage: 'lengthconvert <value> <from> <to>',
  examples: ['lengthconvert 100 cm m', 'lengthconvert 1 mi km'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (args.length < 3) return reply('❌ Usage: lengthconvert <value> <from> <to>\nUnits: mm, cm, m, km, in, ft, yd, mi');
    const value = parseFloat(args[0]);
    const from = args[1].toLowerCase();
    const to = args[2].toLowerCase();
    
    if (isNaN(value)) return reply('❌ Invalid value!');
    if (!conversions[from] || !conversions[to]) return reply('❌ Invalid unit! Use: mm, cm, m, km, in, ft, yd, mi');
    
    const meters = value * conversions[from];
    const result = meters / conversions[to];
    
    await reply(`📏 LENGTH CONVERSION\n\n${value} ${from} = ${result.toFixed(4)} ${to}`);
  },
};
