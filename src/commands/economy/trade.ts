import type { Command } from '../../types/index.js';
export const command: Command = { name: 'trade', aliases: ['palitan'], description: 'Trade with someone', category: 'economy', usage: 'trade @mention <item>', examples: ['trade @John sword'], cooldown: 10000,
  async execute({ reply, args, event }) { const target = Object.values(event.mentions || {})[0]; if (!target) return reply('❌ Mention someone!'); const item = args.slice(1).join(' ') || 'item'; await reply(`🤝 Trade request sent to ${target} for ${item}!`); },
};
