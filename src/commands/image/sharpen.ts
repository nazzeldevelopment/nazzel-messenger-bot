import type { Command } from '../../types/index.js';
export const command: Command = { name: 'sharpen', aliases: ['sharp'], description: 'Sharpen image', category: 'image', usage: 'sharpen (reply to image)', examples: ['sharpen'], cooldown: 5000,
  async execute({ reply, event }) { if (!event.messageReply?.attachments?.[0]) return reply('❌ Reply to an image!'); await reply('🔪 Sharpen - requires image processing integration!'); },
};
