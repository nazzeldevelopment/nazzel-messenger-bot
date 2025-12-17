import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'contrast',
  aliases: ['contrastimg'],
  description: 'Adjust image contrast',
  category: 'image',
  usage: 'contrast <-100 to 100> (reply to image)',
  examples: ['contrast 50'],
  cooldown: 5000,
  async execute({ reply, args, event }) {
    if (!event.messageReply?.attachments?.[0]) {
      return reply('❌ Reply to an image to adjust contrast!');
    }
    const level = parseInt(args[0]) || 50;
    await reply(`🎨 Contrast ${level > 0 ? '+' : ''}${level} - requires image processing library integration!`);
  },
};
