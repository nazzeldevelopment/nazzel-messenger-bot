import type { Command } from '../../types/index.js';
const pokes = ['*pokes {target}* 👉', '*pokes {target}* hey! 😊', '*poke poke* {target}! 💫', '*gently pokes {target}* 🤭'];
export const command: Command = { name: 'poke', aliases: ['duro'], description: 'Poke someone', category: 'roleplay', usage: 'poke @mention', examples: ['poke @John'], cooldown: 3000,
  async execute({ reply, event }) { const target = Object.values(event.mentions || {})[0] || 'someone'; await reply(pokes[Math.floor(Math.random() * pokes.length)].replace('{target}', target as string)); },
};
