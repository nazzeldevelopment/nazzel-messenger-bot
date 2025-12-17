import type { Command } from '../../types/index.js';
export const command: Command = { name: 'guessthenumber', aliases: ['gtn'], description: 'Guess the number game', category: 'games', usage: 'guessthenumber', examples: ['guessthenumber'], cooldown: 5000,
  async execute({ reply }) { const num = Math.floor(Math.random() * 10) + 1; await reply(`🔢 I'm thinking of a number 1-10. Use: numguess to play!`); },
};
