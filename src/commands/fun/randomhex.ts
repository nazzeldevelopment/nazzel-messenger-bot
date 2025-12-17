import type { Command } from '../../types/index.js';
export const command: Command = { name: 'randomhex', aliases: ['hexcolor'], description: 'Random hex color', category: 'fun', usage: 'randomhex', examples: ['randomhex'], cooldown: 3000,
  async execute({ reply }) { const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase(); await reply(`🎨 HEX: ${hex}`); },
};
