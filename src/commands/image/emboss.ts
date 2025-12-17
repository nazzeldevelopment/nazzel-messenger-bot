import type { Command } from '../../types/index.js';
export const command: Command = { name: 'emboss', aliases: ['embossed'], description: 'Emboss effect', category: 'image', usage: 'emboss (reply to image)', examples: ['emboss'], cooldown: 5000,
  async execute({ reply, event }) { if (!event.messageReply?.attachments?.[0]) return reply('❌ Reply to an image!'); await reply('🖼️ Emboss - requires image processing integration!'); },
};
