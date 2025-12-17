import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'grayscale',
  aliases: ['gray', 'bw', 'blackwhite'],
  description: 'Convert image to grayscale',
  category: 'image',
  usage: 'grayscale (reply to image)',
  examples: ['grayscale'],
  cooldown: 5000,
  async execute({ reply, event }) {
    if (!event.messageReply?.attachments?.[0]) {
      return reply('❌ Reply to an image to convert to grayscale!');
    }
    await reply('⬛⬜ Grayscale feature - requires image processing library integration!');
  },
};
