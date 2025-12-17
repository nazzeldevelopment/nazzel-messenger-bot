import type { Command } from '../../types/index.js';
export const command: Command = { name: 'countdownto', aliases: ['daysuntil'], description: 'Count days until a date', category: 'tools', usage: 'countdownto <YYYY-MM-DD>', examples: ['countdownto 2024-12-25'], cooldown: 3000,
  async execute({ reply, args }) { if (!args.length) return reply('❌ Provide date (YYYY-MM-DD)'); const date = new Date(args[0]); if (isNaN(date.getTime())) return reply('❌ Invalid date!'); const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)); await reply(`⏳ ${days} days until ${args[0]}`); },
};
