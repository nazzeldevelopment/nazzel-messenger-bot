import type { Command } from '../../types/index.js';
const pets = ['🐕 Dog', '🐈 Cat', '🐰 Bunny', '🦜 Parrot', '🐹 Hamster', '🦎 Lizard'];
export const command: Command = { name: 'pet', aliases: ['alaga'], description: 'View your pet', category: 'economy', usage: 'pet', examples: ['pet'], cooldown: 10000,
  async execute({ reply }) { const pet = pets[Math.floor(Math.random() * pets.length)]; await reply(`🐾 YOUR PET\n\n${pet}\n\nHappiness: ❤️❤️❤️\nHunger: 🍖🍖🍖`); },
};
