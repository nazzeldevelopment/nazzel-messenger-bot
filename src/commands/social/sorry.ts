import type { Command } from '../../types/index.js';

const messages = [
  '🙏 Sorry {target}... I didn\'t mean to 😔',
  '💔 I\'m so sorry {target}... Please forgive me 🥺',
  '😢 Sorry {target}... I feel really bad 💔',
  '🙇 My apologies {target}... 🙏',
  '😞 Sorry po {target}... Patawad 🙏',
];

export const command: Command = {
  name: 'sorry',
  aliases: ['apologize', 'pasensya', 'patawad'],
  description: 'Apologize to someone',
  category: 'social',
  usage: 'sorry @mention',
  examples: ['sorry @John'],
  cooldown: 5000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'everyone';
    const msg = messages[Math.floor(Math.random() * messages.length)].replace('{target}', target as string);
    await reply(msg);
  },
};
