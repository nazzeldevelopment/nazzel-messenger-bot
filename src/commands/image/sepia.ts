import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'sepia',
  aliases: ['vintage', 'old'],
  description: 'Apply sepia filter to image',
  category: 'image',
  usage: 'sepia (reply to image)',
  examples: ['sepia'],
  cooldown: 5000,
  async execute({ reply, event }) {
    if (!event.messageReply?.attachments?.[0]) {
      return reply('❌ Reply to an image to apply sepia filter!');
    }
    await reply('🟤 Sepia filter feature - requires image processing library integration!');
  },
};
