import type { Command } from '../../types/index.js';

const emojiSets = [
  '😀😃😄😁😆😅🤣😂',
  '❤️🧡💛💚💙💜🖤🤍',
  '🐶🐱🐭🐹🐰🦊🐻🐼',
  '🍎🍊🍋🍇🍓🫐🍑🍒',
  '⭐🌟✨💫⚡🔥💥💢',
  '🎮🎲🎯🎪🎨🎬🎤🎧',
  '🌈☀️🌤️⛅🌦️🌧️⛈️🌩️',
  '🚀🛸🌙⭐🌍🌎🌏🪐',
];

export const command: Command = {
  name: 'emoji',
  aliases: ['emojis', 'randomemoji'],
  description: 'Get random emojis',
  category: 'fun',
  usage: 'emoji',
  examples: ['emoji'],
  cooldown: 3000,
  async execute({ reply }) {
    const set = emojiSets[Math.floor(Math.random() * emojiSets.length)];
    await reply(set);
  },
};
