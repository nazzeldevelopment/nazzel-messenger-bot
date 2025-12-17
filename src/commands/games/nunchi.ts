import type { Command } from '../../types/index.js';
const counts = new Map<string, number>();
export const command: Command = { name: 'nunchi', aliases: ['nunchistart'], description: 'Korean counting game', category: 'games', usage: 'nunchi | nunchi <number>', examples: ['nunchi', 'nunchi 1'], cooldown: 2000,
  async execute({ reply, args, event }) { const tid = event.threadID; if (!args.length) { counts.set(tid, 0); return reply('🔢 NUNCHI\n\nCount from 1! Only one person per number!'); } const current = counts.get(tid) || 0; const num = parseInt(args[0]); if (num === current + 1) { counts.set(tid, num); await reply(`✅ ${num}!`); } else { counts.set(tid, 0); await reply(`❌ Wrong! Game reset.`); } },
};
