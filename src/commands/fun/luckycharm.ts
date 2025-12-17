import type { Command } from '../../types/index.js';
const charms = ['🍀 Four-leaf clover', '🐞 Ladybug', '🌈 Rainbow', '⭐ Shooting star', '🎰 Lucky 7', '🧲 Horseshoe', '🐇 Rabbit foot'];
export const command: Command = { name: 'luckycharm', aliases: ['charm'], description: 'Get a lucky charm', category: 'fun', usage: 'luckycharm', examples: ['luckycharm'], cooldown: 5000,
  async execute({ reply }) { await reply(`✨ YOUR LUCKY CHARM\n\n${charms[Math.floor(Math.random() * charms.length)]}`); },
};
