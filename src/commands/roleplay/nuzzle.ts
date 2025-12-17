import type { Command } from '../../types/index.js';
const nuzzles = ['*nuzzles {target}* 🥰', '*nuzzles cutely* owo 💕', '*soft nuzzle on {target}* ✨', '*nuzzle nuzzle* uwu 🌸'];
export const command: Command = { name: 'nuzzle', aliases: ['nuzz'], description: 'Nuzzle someone', category: 'roleplay', usage: 'nuzzle @mention', examples: ['nuzzle @John'], cooldown: 3000,
  async execute({ reply, event }) { const target = Object.values(event.mentions || {})[0] || 'someone'; await reply(nuzzles[Math.floor(Math.random() * nuzzles.length)].replace('{target}', target as string)); },
};
