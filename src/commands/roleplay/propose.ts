import type { Command } from '../../types/index.js';
export const command: Command = { name: 'propose', aliases: ['marry', 'ikasal'], description: 'Propose to someone', category: 'roleplay', usage: 'propose @mention', examples: ['propose @John'], cooldown: 30000,
  async execute({ reply, event }) { const target = Object.values(event.mentions || {})[0] || 'someone'; await reply(`💍 *gets down on one knee*\n\n${target}, will you marry me? 💕\n\n🌹 React YES or NO 🌹`); },
};
