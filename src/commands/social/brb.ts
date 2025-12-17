import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'brb',
  aliases: ['bebackright', 'afk'],
  description: 'Let others know you\'ll be right back',
  category: 'social',
  usage: 'brb [reason]',
  examples: ['brb', 'brb eating lunch'],
  cooldown: 10000,
  async execute({ reply, args }) {
    const reason = args.length > 0 ? args.join(' ') : 'somewhere';
    await reply(`⏰ BRB\n\n🚶 Going to ${reason}\n⏱️ Will be back soon!\n\n💬 Don't miss me too much! 😉`);
  },
};
