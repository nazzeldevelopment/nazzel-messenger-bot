import type { Command } from '../../types/index.js';
export const command: Command = { name: 'casino', aliases: ['sugalan'], description: 'Visit the casino', category: 'economy', usage: 'casino <amount>', examples: ['casino 100'], cooldown: 10000,
  async execute({ reply, args }) { const amt = parseInt(args[0]) || 10; const win = Math.random() > 0.5; await reply(`🎰 CASINO\n\n${win ? `🎉 You won $${amt * 2}!` : `💸 You lost $${amt}...`}`); },
};
