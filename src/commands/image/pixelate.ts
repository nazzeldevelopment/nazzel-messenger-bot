import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'pixelate',
  aliases: ['pixel', '8bit'],
  description: 'Pixelate an image',
  category: 'image',
  usage: 'pixelate (reply to image)',
  examples: ['pixelate'],
  cooldown: 5000,
  async execute({ reply, event }) {
    if (!event.messageReply?.attachments?.[0]) {
      return reply('❌ Reply to an image to pixelate it!');
    }
    await reply('🟩🟨🟦 Pixelate feature - requires image processing library integration!');
  },
};
