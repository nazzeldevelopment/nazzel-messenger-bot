import type { Command } from '../../types/index.js';

const messages = [
  '💕 I miss you {target}! 😢',
  '💔 Missing you {target}... 🥺',
  '😢 {target}, kamusta na? Miss kita! 💕',
  '🌸 Thinking of you {target}... miss you! 💖',
  '💗 {target}! I miss you so much! 😭',
];

export const command: Command = {
  name: 'missyou',
  aliases: ['miss', 'misskita'],
  description: 'Tell someone you miss them',
  category: 'social',
  usage: 'missyou @mention',
  examples: ['missyou @John'],
  cooldown: 5000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'you';
    const msg = messages[Math.floor(Math.random() * messages.length)].replace('{target}', target as string);
    await reply(msg);
  },
};
