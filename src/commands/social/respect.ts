import type { Command } from '../../types/index.js';
export const command: Command = { name: 'respect', aliases: ['salute'], description: 'Show respect', category: 'social', usage: 'respect @mention', examples: ['respect @John'], cooldown: 5000,
  async execute({ reply, event }) { const target = Object.values(event.mentions || {})[0] || 'you'; await reply(`🫡 Respect to ${target}! 👏`); },
};
