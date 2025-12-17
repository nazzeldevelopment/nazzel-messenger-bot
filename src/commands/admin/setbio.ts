import type { Command } from '../../types/index.js';
export const command: Command = { name: 'setbio', aliases: ['bio'], description: 'Set bot bio', category: 'admin', usage: 'setbio <bio>', examples: ['setbio Hello world'], cooldown: 60000, permissions: ['admin'],
  async execute({ reply, args, api }) { if (!args.length) return reply('❌ Provide a bio!'); await reply(`📝 Bio updated to: ${args.join(' ')}`); },
};
