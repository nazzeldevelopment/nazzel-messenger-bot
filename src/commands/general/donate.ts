import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'donate',
  aliases: ['support', 'tip'],
  description: 'Support the bot',
  category: 'general',
  usage: 'donate',
  examples: ['donate'],
  cooldown: 10000,
  async execute({ reply }) {
    await reply(`💖 SUPPORT THE BOT\n\nThank you for considering a donation!\n\n🎁 Your support helps keep the bot running!\n\n📱 Contact the owner for donation methods.`);
  },
};
