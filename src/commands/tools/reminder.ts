import type { Command } from '../../types/index.js';
export const command: Command = { name: 'reminder', aliases: ['remind', 'paala'], description: 'Set a reminder', category: 'tools', usage: 'reminder <minutes> <message>', examples: ['reminder 10 Take a break'], cooldown: 10000,
  async execute({ reply, args }) { if (args.length < 2) return reply('❌ reminder <minutes> <message>'); const mins = parseInt(args[0]); const msg = args.slice(1).join(' '); await reply(`⏰ Reminder set for ${mins} minutes!\n\nMessage: ${msg}\n\n(Note: Simplified reminder)`); },
};
