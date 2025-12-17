import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'tempconvert',
  aliases: ['temp', 'celsius', 'fahrenheit'],
  description: 'Convert temperature',
  category: 'tools',
  usage: 'tempconvert <value> <C/F>',
  examples: ['tempconvert 100 C', 'tempconvert 212 F'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (args.length < 2) return reply('❌ Usage: tempconvert <value> <C/F>');
    const value = parseFloat(args[0]);
    const unit = args[1].toUpperCase();
    
    if (isNaN(value)) return reply('❌ Invalid temperature!');
    
    let result: number;
    let fromUnit: string;
    let toUnit: string;
    
    if (unit === 'C') {
      result = (value * 9/5) + 32;
      fromUnit = '°C';
      toUnit = '°F';
    } else if (unit === 'F') {
      result = (value - 32) * 5/9;
      fromUnit = '°F';
      toUnit = '°C';
    } else {
      return reply('❌ Use C for Celsius or F for Fahrenheit!');
    }
    
    await reply(`🌡️ TEMPERATURE\n\n${value}${fromUnit} = ${result.toFixed(2)}${toUnit}`);
  },
};
