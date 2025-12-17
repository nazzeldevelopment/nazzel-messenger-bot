import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'getwell',
  aliases: ['getwellsoon', 'gws'],
  description: 'Wish someone to get well soon',
  category: 'social',
  usage: 'getwell @mention',
  examples: ['getwell @John'],
  cooldown: 5000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'you';
    await reply(`🌸 GET WELL SOON ${target}! 🌸\n\n💊 Wishing you a speedy recovery! 🙏\n❤️ Take care and rest well! 😊\n🌟 Sending healing vibes! ✨`);
  },
};
