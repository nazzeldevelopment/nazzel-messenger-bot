import type { Command } from '../../types/index.js';
const puns = ["I'm on a seafood diet. I see food and I eat it!", "Time flies like an arrow. Fruit flies like a banana.", "I used to be a banker but I lost interest.", "I'm reading a book on the history of glue – I can't put it down!", "I wondered why the baseball was getting bigger. Then it hit me."];
export const command: Command = { name: 'pun', aliases: ['puns'], description: 'Get a pun', category: 'fun', usage: 'pun', examples: ['pun'], cooldown: 5000,
  async execute({ reply }) { await reply(`😄 PUN\n\n${puns[Math.floor(Math.random() * puns.length)]}`); },
};
