import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'mirror',
  aliases: ['fliph', 'horizontal'],
  description: 'Mirror an image horizontally',
  category: 'image',
  usage: 'mirror (reply to image)',
  examples: ['mirror'],
  cooldown: 5000,
  async execute({ reply, event }) {
    if (!event.messageReply?.attachments?.[0]) {
      return reply('❌ Reply to an image to mirror it!');
    }
    await reply('🪞 Mirror feature - requires image processing library integration!');
  },
};
