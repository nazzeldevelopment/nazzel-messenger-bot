import type { Command } from '../../types/index.js';

const messages = [
  '*tilts head* huh? 🤔',
  '*confused noises* ??? 😕',
  '*scratches head* what? 🧐',
  '*visible confusion* ❓',
  '*brain.exe stopped working* 💭'
];

export const command: Command = {
  name: 'confused',
  aliases: ['huh', 'lito'],
  description: 'Express confusion',
  category: 'roleplay',
  usage: 'confused',
  examples: ['confused'],
  cooldown: 3000,
  async execute({ reply }) {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    await reply(msg);
  },
};
