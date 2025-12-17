import type { Command } from '../../types/index.js';
export const command: Command = { name: 'takecare', aliases: ['ingat', 'becareful'], description: 'Tell someone to take care', category: 'social', usage: 'takecare @mention', examples: ['takecare @John'], cooldown: 5000,
  async execute({ reply, event }) { const target = Object.values(event.mentions || {})[0] || 'you'; await reply(`💕 Take care ${target}! Stay safe and healthy! 🌸`); },
};
