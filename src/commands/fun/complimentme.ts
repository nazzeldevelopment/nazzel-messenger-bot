import type { Command } from '../../types/index.js';
const compliments = ["You're amazing just the way you are!", "Your smile lights up the room!", "You're incredibly talented!", "You have a heart of gold!", "You inspire everyone around you!"];
export const command: Command = { name: 'complimentme', aliases: ['compliment2'], description: 'Get a compliment', category: 'fun', usage: 'complimentme', examples: ['complimentme'], cooldown: 5000,
  async execute({ reply }) { await reply(`💖 ${compliments[Math.floor(Math.random() * compliments.length)]}`); },
};
