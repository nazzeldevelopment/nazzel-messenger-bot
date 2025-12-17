import type { Command } from '../../types/index.js';

const laughs = ['🤣 HAHAHAHAHA!', '😂 *dying of laughter*', '😆 LOL!', '🤭 hehe~', '😹 *laughing uncontrollably*'];

export const command: Command = {
  name: 'laugh', aliases: ['lol', 'tawa', 'haha'], description: 'Laugh expression', category: 'roleplay',
  usage: 'laugh', examples: ['laugh'], cooldown: 3000,
  async execute({ reply }) { await reply(laughs[Math.floor(Math.random() * laughs.length)]); },
};
