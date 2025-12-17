import type { Command } from '../../types/index.js';
export const command: Command = { name: 'flipimg', aliases: ['flipv', 'vertical'], description: 'Flip image vertically', category: 'image', usage: 'flipimg (reply to image)', examples: ['flipimg'], cooldown: 5000,
  async execute({ reply, event }) { if (!event.messageReply?.attachments?.[0]) return reply('❌ Reply to an image!'); await reply('🔄 Vertical flip - requires image processing integration!'); },
};
