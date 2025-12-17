import type { Command } from '../../types/index.js';
export const command: Command = { name: 'crop', aliases: ['cut'], description: 'Crop image', category: 'image', usage: 'crop (reply to image)', examples: ['crop'], cooldown: 5000,
  async execute({ reply, event }) { if (!event.messageReply?.attachments?.[0]) return reply('❌ Reply to an image!'); await reply('✂️ Crop - requires image processing integration!'); },
};
