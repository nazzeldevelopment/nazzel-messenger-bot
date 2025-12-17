import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'welcomemsg',
  aliases: ['welcomenew', 'greet'],
  description: 'Welcome someone to the group',
  category: 'social',
  usage: 'welcomemsg @mention',
  examples: ['welcomemsg @John'],
  cooldown: 5000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'new member';
    await reply(`👋 WELCOME ${target}! 👋\n\n🎉 We're happy to have you here! 🎉\n📖 Check the rules and have fun!\n💬 Don't be shy, say hi! 💬`);
  },
};
