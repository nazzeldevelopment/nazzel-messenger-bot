import type { Command } from '../../types/index.js';

const messages = [
  '👋 Goodbye {target}! See you soon! 💕',
  '🌟 Bye bye {target}! Take care! ✨',
  '💫 Farewell {target}! Until we meet again! 👋',
  '🙋 Bye {target}! Come back soon! 💖',
  '👋 Paalam {target}! Ingat! 💕',
];

export const command: Command = {
  name: 'goodbye',
  aliases: ['bye', 'paalam', 'farewell'],
  description: 'Say goodbye to someone',
  category: 'social',
  usage: 'goodbye @mention',
  examples: ['goodbye @John'],
  cooldown: 5000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const target = Object.values(mentions)[0] || args[0] || 'everyone';
    const msg = messages[Math.floor(Math.random() * messages.length)].replace('{target}', target as string);
    await reply(msg);
  },
};
