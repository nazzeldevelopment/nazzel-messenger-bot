import type { Command } from '../../types/index.js';
export const command: Command = { name: 'level', aliases: ['lvl', 'rank'], description: 'View your level', category: 'economy', usage: 'level', examples: ['level'], cooldown: 5000,
  async execute({ reply }) { const lvl = Math.floor(Math.random() * 50) + 1; const xp = Math.floor(Math.random() * 1000); await reply(`📊 YOUR LEVEL\n\nLevel: ${lvl}\nXP: ${xp}/1000\nProgress: ${'█'.repeat(Math.floor(xp/100))}${'░'.repeat(10 - Math.floor(xp/100))}`); },
};
