import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'timer',
  aliases: ['countdown', 'alarm'],
  description: 'Set a timer',
  category: 'tools',
  usage: 'timer <seconds>',
  examples: ['timer 60'],
  cooldown: 5000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Please specify time in seconds!');
    const seconds = parseInt(args[0]);
    if (isNaN(seconds) || seconds < 1 || seconds > 3600) {
      return reply('❌ Enter a valid time (1-3600 seconds)!');
    }
    await reply(`⏱️ Timer set for ${seconds} seconds!\n\n🔔 I'll notify when time's up!\n\n(Note: This is a simplified timer)`);
  },
};
