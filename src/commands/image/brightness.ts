import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'brightness',
  aliases: ['bright', 'lighten'],
  description: 'Adjust image brightness',
  category: 'image',
  usage: 'brightness <-100 to 100> (reply to image)',
  examples: ['brightness 50'],
  cooldown: 5000,
  async execute({ reply, args, event }) {
    if (!event.messageReply?.attachments?.[0]) {
      return reply('❌ Reply to an image to adjust brightness!');
    }
    const level = parseInt(args[0]) || 50;
    await reply(`☀️ Brightness ${level > 0 ? '+' : ''}${level} - requires image processing library integration!`);
  },
};
