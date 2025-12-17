import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'rotate',
  aliases: ['turn', 'spin'],
  description: 'Rotate an image',
  category: 'image',
  usage: 'rotate <90/180/270> (reply to image)',
  examples: ['rotate 90'],
  cooldown: 5000,
  async execute({ reply, args, event }) {
    if (!event.messageReply?.attachments?.[0]) {
      return reply('❌ Reply to an image to rotate it!');
    }
    const degrees = parseInt(args[0]) || 90;
    await reply(`🔄 Rotate ${degrees}° - requires image processing library integration!`);
  },
};
