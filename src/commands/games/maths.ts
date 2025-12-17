import type { Command } from '../../types/index.js';
const games = new Map<string, { answer: number }>();
export const command: Command = { name: 'quickmath', aliases: ['qmath'], description: 'Quick math challenge', category: 'games', usage: 'quickmath | quickmath <answer>', examples: ['quickmath', 'quickmath 42'], cooldown: 3000,
  async execute({ reply, args, event }) { const tid = event.threadID; if (!args.length) { const a = Math.floor(Math.random() * 50) + 1; const b = Math.floor(Math.random() * 50) + 1; const ops = ['+', '-', '*']; const op = ops[Math.floor(Math.random() * 3)]; const answer = op === '+' ? a + b : op === '-' ? a - b : a * b; games.set(tid, { answer }); return reply(`🧮 QUICK MATH!\n\n${a} ${op} ${b} = ?`); } const game = games.get(tid); if (!game) return reply('❌ Start with: quickmath'); if (parseInt(args[0]) === game.answer) { games.delete(tid); await reply('🎉 CORRECT!'); } else await reply('❌ Wrong!'); },
};
