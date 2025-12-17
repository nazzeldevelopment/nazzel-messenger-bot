import type { Command } from '../../types/index.js';
export const command: Command = { name: 'steal', aliases: ['pickpocket'], description: 'Steal from someone', category: 'economy', usage: 'steal @mention', examples: ['steal @John'], cooldown: 30000,
  async execute({ reply, event }) { const target = Object.values(event.mentions || {})[0] || 'someone'; const success = Math.random() > 0.5; if (success) { const amt = Math.floor(Math.random() * 100) + 10; await reply(`🤫 You stole $${amt} from ${target}!`); } else await reply(`😅 ${target} caught you! Lost $25.`); },
};
