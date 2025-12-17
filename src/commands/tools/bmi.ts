import type { Command } from '../../types/index.js';
export const command: Command = { name: 'bmi', aliases: ['bmicalc'], description: 'Calculate BMI', category: 'tools', usage: 'bmi <weight_kg> <height_cm>', examples: ['bmi 70 170'], cooldown: 3000,
  async execute({ reply, args }) { if (args.length < 2) return reply('❌ bmi <weight_kg> <height_cm>'); const weight = parseFloat(args[0]); const height = parseFloat(args[1]) / 100; const bmi = (weight / (height * height)).toFixed(1); let cat = 'Normal'; if (parseFloat(bmi) < 18.5) cat = 'Underweight'; else if (parseFloat(bmi) >= 25) cat = 'Overweight'; else if (parseFloat(bmi) >= 30) cat = 'Obese'; await reply(`⚖️ BMI: ${bmi}\nCategory: ${cat}`); },
};
