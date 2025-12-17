import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'birthday',
  aliases: ['bday', 'kaarawan'],
  description: 'Wish someone a happy birthday',
  category: 'social',
  usage: 'birthday @mention',
  examples: ['birthday @John'],
  cooldown: 5000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'you';
    await reply(`🎂🎉 HAPPY BIRTHDAY ${target}! 🎉🎂\n\n🎈 May all your wishes come true! 🎈\n🎁 Have an amazing day! 🎁\n🎊 Party time! 🎊`);
  },
};
