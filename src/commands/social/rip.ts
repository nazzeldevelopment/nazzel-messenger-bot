import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'rip',
  aliases: ['f', 'pressf'],
  description: 'Press F to pay respects',
  category: 'social',
  usage: 'rip @mention',
  examples: ['rip @John'],
  cooldown: 5000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'fallen one';
    await reply(`🪦 REST IN PEACE 🪦\n\n💐 ${target} 💐\n\n🕯️ Press F to pay respects 🕯️\n\nF`);
  },
};
