import type { Command } from '../../types/index.js';
export const command: Command = { name: 'posterize', aliases: ['poster'], description: 'Posterize image', category: 'image', usage: 'posterize (reply to image)', examples: ['posterize'], cooldown: 5000,
  async execute({ reply, event }) { if (!event.messageReply?.attachments?.[0]) return reply('❌ Reply to an image!'); await reply('🎨 Posterize - requires image processing integration!'); },
};
