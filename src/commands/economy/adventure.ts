import type { Command } from '../../types/index.js';
const events = ['Found a treasure chest! +$100', 'Defeated a dragon! +$200', 'Fell into a trap! -$50', 'Met a friendly merchant! +$75', 'Got lost... -$25', 'Discovered ancient ruins! +$150'];
export const command: Command = { name: 'adventure', aliases: ['explore'], description: 'Go on adventure', category: 'economy', usage: 'adventure', examples: ['adventure'], cooldown: 60000,
  async execute({ reply }) { const event = events[Math.floor(Math.random() * events.length)]; await reply(`🗺️ ADVENTURE\n\n${event}`); },
};
