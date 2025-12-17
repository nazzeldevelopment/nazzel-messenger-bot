import type { Command } from '../../types/index.js';
export const command: Command = { name: 'edgedetect', aliases: ['edges', 'outline'], description: 'Edge detection', category: 'image', usage: 'edgedetect (reply to image)', examples: ['edgedetect'], cooldown: 5000,
  async execute({ reply, event }) { if (!event.messageReply?.attachments?.[0]) return reply('❌ Reply to an image!'); await reply('✏️ Edge detection - requires image processing integration!'); },
};
