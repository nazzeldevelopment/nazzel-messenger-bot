import type { Command } from '../../types/index.js';
export const command: Command = { name: 'duel', aliases: ['fight', 'laban'], description: 'Duel someone', category: 'economy', usage: 'duel @mention <bet>', examples: ['duel @John 100'], cooldown: 30000,
  async execute({ reply, args, event }) { const target = Object.values(event.mentions || {})[0]; if (!target) return reply('❌ Mention someone!'); const bet = parseInt(args[1]) || 50; const win = Math.random() > 0.5; await reply(`⚔️ DUEL vs ${target}\n\nBet: $${bet}\n\n${win ? `🎉 You won $${bet}!` : `💀 You lost $${bet}!`}`); },
};
