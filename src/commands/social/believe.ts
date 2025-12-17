import type { Command } from '../../types/index.js';
export const command: Command = { name: 'believe', aliases: ['believeinyou'], description: 'Tell someone you believe in them', category: 'social', usage: 'believe @mention', examples: ['believe @John'], cooldown: 5000,
  async execute({ reply, event }) { const target = Object.values(event.mentions || {})[0] || 'you'; await reply(`✨ I believe in ${target}! You can do anything! 🌈`); },
};
