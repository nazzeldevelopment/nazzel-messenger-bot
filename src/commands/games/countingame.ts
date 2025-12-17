import type { Command } from '../../types/index.js';
const counts = new Map<string, number>();
export const command: Command = { name: 'countinggame', aliases: ['counting', 'bilang'], description: 'Group counting game', category: 'games', usage: 'countinggame [number]', examples: ['countinggame 1'], cooldown: 2000,
  async execute({ reply, args, event }) {
    const tid = event.threadID;
    if (args[0] === 'reset') { counts.set(tid, 0); return reply('🔢 Counter reset to 0!'); }
    const current = counts.get(tid) || 0;
    const guess = parseInt(args[0]);
    if (isNaN(guess)) return reply(`🔢 Current: ${current}. Next: ${current + 1}`);
    if (guess === current + 1) { counts.set(tid, guess); await reply(`✅ ${guess}!`); }
    else { counts.set(tid, 0); await reply(`❌ Wrong! It was ${current + 1}. Reset to 0.`); }
  },
};
