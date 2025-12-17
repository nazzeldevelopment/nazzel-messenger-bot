import type { Command } from '../../types/index.js';
export const command: Command = { name: 'giverep', aliases: ['+rep', 'plusrep'], description: 'Give reputation', category: 'economy', usage: 'giverep @mention', examples: ['giverep @John'], cooldown: 86400000,
  async execute({ reply, event }) { const target = Object.values(event.mentions || {})[0]; if (!target) return reply('❌ Mention someone!'); await reply(`⭐ You gave +1 reputation to ${target}!`); },
};
