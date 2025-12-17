import type { Command } from '../../types/index.js';
export const command: Command = { name: 'bankrob', aliases: ['heist'], description: 'Rob the bank', category: 'economy', usage: 'bankrob', examples: ['bankrob'], cooldown: 60000,
  async execute({ reply }) { const success = Math.random() > 0.7; if (success) { const amt = Math.floor(Math.random() * 500) + 100; await reply(`💰 You robbed $${amt} from the bank!`); } else await reply('🚔 You got caught! Lost $50.'); },
};
