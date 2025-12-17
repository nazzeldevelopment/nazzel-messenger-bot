import type { Command } from '../../types/index.js';
const excuses = ["My dog ate my homework.", "I was abducted by aliens.", "Mercury is in retrograde.", "I had to wash my hair.", "My goldfish passed away.", "I got stuck in traffic.", "My alarm didn't go off.", "I thought it was tomorrow."];
export const command: Command = { name: 'excuse', aliases: ['excuses'], description: 'Generate an excuse', category: 'fun', usage: 'excuse', examples: ['excuse'], cooldown: 5000,
  async execute({ reply }) { await reply(`🙈 EXCUSE\n\n"${excuses[Math.floor(Math.random() * excuses.length)]}"`); },
};
