import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'resize',
  aliases: ['scale', 'size'],
  description: 'Resize an image',
  category: 'image',
  usage: 'resize <width> <height> (reply to image)',
  examples: ['resize 500 500'],
  cooldown: 5000,
  async execute({ reply, args, event }) {
    if (!event.messageReply?.attachments?.[0]) {
      return reply('❌ Reply to an image to resize it!');
    }
    const width = parseInt(args[0]) || 500;
    const height = parseInt(args[1]) || 500;
    await reply(`📐 Resize to ${width}x${height} - requires image processing library integration!`);
  },
};
