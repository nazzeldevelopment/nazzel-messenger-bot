import type { Command } from '../../types/index.js';

const results = ['🔴 Red', '🟠 Orange', '🟡 Yellow', '🟢 Green', '🔵 Blue', '🟣 Purple', '⚫ Black', '⚪ White'];

export const command: Command = {
  name: 'spinner', aliases: ['spin', 'wheel'], description: 'Spin the wheel', category: 'fun',
  usage: 'spinner', examples: ['spinner'], cooldown: 5000,
  async execute({ reply }) {
    const result = results[Math.floor(Math.random() * results.length)];
    await reply(`🎡 SPINNING...\n\n🎯 Result: ${result}`);
  },
};
