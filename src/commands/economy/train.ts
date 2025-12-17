import type { Command } from '../../types/index.js';
export const command: Command = { name: 'train', aliases: ['ensayo'], description: 'Train your character', category: 'economy', usage: 'train', examples: ['train'], cooldown: 60000,
  async execute({ reply }) { const xp = Math.floor(Math.random() * 50) + 10; await reply(`🏋️ TRAINING\n\nYou trained hard!\n\nXP gained: +${xp}\nStamina: -10`); },
};
