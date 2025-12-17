import type { Command } from '../../types/index.js';
const insults = ["You're about as useful as a screen door on a submarine.", "If brains were dynamite, you wouldn't have enough to blow your nose.", "You're not the dumbest person alive, but you better hope they don't die.", "You're like a cloud - when you disappear, it's a beautiful day."];
export const command: Command = { name: 'roast', aliases: ['insult', 'burn'], description: 'Playful roast', category: 'fun', usage: 'roast @mention', examples: ['roast @John'], cooldown: 10000,
  async execute({ reply, event }) { const target = Object.values(event.mentions || {})[0] || 'someone'; await reply(`🔥 ROAST\n\n${insults[Math.floor(Math.random() * insults.length)]}`); },
};
