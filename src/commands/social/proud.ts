import type { Command } from '../../types/index.js';
export const command: Command = { name: 'proud', aliases: ['proudofyou'], description: 'Tell someone you\'re proud', category: 'social', usage: 'proud @mention', examples: ['proud @John'], cooldown: 5000,
  async execute({ reply, event }) { const target = Object.values(event.mentions || {})[0] || 'you'; await reply(`🌟 I'm so proud of ${target}! You're doing amazing! 💪`); },
};
