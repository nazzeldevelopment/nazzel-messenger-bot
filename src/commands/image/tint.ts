import type { Command } from '../../types/index.js';
export const command: Command = { name: 'tint', aliases: ['colorize'], description: 'Tint image with color', category: 'image', usage: 'tint <color> (reply to image)', examples: ['tint blue'], cooldown: 5000,
  async execute({ reply, args, event }) { if (!event.messageReply?.attachments?.[0]) return reply('❌ Reply to an image!'); const color = args[0] || 'blue'; await reply(`🎨 Tint ${color} - requires image processing integration!`); },
};
