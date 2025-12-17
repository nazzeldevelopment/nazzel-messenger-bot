import type { Command } from '../../types/index.js';
export const command: Command = { name: 'youmatter', aliases: ['matter'], description: 'Remind someone they matter', category: 'social', usage: 'youmatter @mention', examples: ['youmatter @John'], cooldown: 5000,
  async execute({ reply, event }) { const target = Object.values(event.mentions || {})[0] || 'everyone'; await reply(`💖 Hey ${target}, you matter! Never forget that! 🌟`); },
};
