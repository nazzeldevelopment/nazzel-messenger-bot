import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'congrats',
  aliases: ['congratulations', 'gratz', 'congratz'],
  description: 'Congratulate someone',
  category: 'social',
  usage: 'congrats @mention',
  examples: ['congrats @John'],
  cooldown: 5000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'you';
    await reply(`🎉🎊 CONGRATULATIONS ${target}! 🎊🎉\n\n🏆 You did it! Amazing! 🏆\n⭐ So proud of you! ⭐\n🎈 Keep shining! 🎈`);
  },
};
