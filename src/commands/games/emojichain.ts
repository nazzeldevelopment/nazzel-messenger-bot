import type { Command } from '../../types/index.js';
const emojis = ['🎉', '🔥', '💖', '⭐', '🌈', '🎸', '🎮', '🍕', '🚀', '🌟'];
export const command: Command = { name: 'emojichain', aliases: ['ec'], description: 'Emoji chain game', category: 'games', usage: 'emojichain', examples: ['emojichain'], cooldown: 5000,
  async execute({ reply }) { const chain = []; for (let i = 0; i < 5; i++) chain.push(emojis[Math.floor(Math.random() * emojis.length)]); await reply(`🔗 EMOJI CHAIN\n\nMemorize: ${chain.join('')}\n\n(Reply with the sequence!)`); },
};
