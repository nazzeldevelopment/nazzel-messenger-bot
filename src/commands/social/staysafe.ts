import type { Command } from '../../types/index.js';
export const command: Command = { name: 'staysafe', aliases: ['safe'], description: 'Tell someone to stay safe', category: 'social', usage: 'staysafe @mention', examples: ['staysafe @John'], cooldown: 5000,
  async execute({ reply, event }) { const target = Object.values(event.mentions || {})[0] || 'everyone'; await reply(`🛡️ Stay safe ${target}! We care about you! 💙`); },
};
