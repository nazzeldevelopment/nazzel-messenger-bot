import type { Command } from '../../types/index.js';

const scares = ['😱 AHHHHH!', '😨 *trembling in fear*', '🙀 SO SCARY!', '😰 *hiding* s-scary...', '💀 *dead from fear*'];

export const command: Command = {
  name: 'scared', aliases: ['fear', 'takot'], description: 'Scared expression', category: 'roleplay',
  usage: 'scared', examples: ['scared'], cooldown: 3000,
  async execute({ reply }) { await reply(scares[Math.floor(Math.random() * scares.length)]); },
};
