import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'randomcolor',
  aliases: ['color', 'hex'],
  description: 'Generate a random color',
  category: 'fun',
  usage: 'randomcolor',
  examples: ['randomcolor'],
  cooldown: 3000,
  async execute({ reply }) {
    const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    await reply(`🎨 RANDOM COLOR\n\nHEX: ${hex.toUpperCase()}\nRGB: ${r}, ${g}, ${b}`);
  },
};
