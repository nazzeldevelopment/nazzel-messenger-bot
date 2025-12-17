import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'invert',
  aliases: ['invertcolors', 'negative'],
  description: 'Invert image colors',
  category: 'image',
  usage: 'invert (reply to image)',
  examples: ['invert'],
  cooldown: 5000,
  async execute({ reply, event }) {
    if (!event.messageReply?.attachments?.[0]) {
      return reply('❌ Reply to an image to invert it!');
    }
    await reply('🔄 Image invert feature - requires image processing library integration!');
  },
};
