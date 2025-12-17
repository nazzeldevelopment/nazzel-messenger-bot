import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'blur',
  aliases: ['blurimage'],
  description: 'Blur an image',
  category: 'image',
  usage: 'blur (reply to image)',
  examples: ['blur'],
  cooldown: 5000,
  async execute({ reply, event }) {
    if (!event.messageReply?.attachments?.[0]) {
      return reply('❌ Reply to an image to blur it!');
    }
    await reply('🔵 Image blur feature - requires image processing library integration!');
  },
};
