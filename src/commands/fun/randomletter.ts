import type { Command } from '../../types/index.js';
export const command: Command = { name: 'randomletter', aliases: ['letter'], description: 'Random letter', category: 'fun', usage: 'randomletter', examples: ['randomletter'], cooldown: 3000,
  async execute({ reply }) { await reply(`🔤 ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`); },
};
