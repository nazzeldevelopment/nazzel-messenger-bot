import type { Command } from '../../types/index.js';

const boreds = ['😑 *sighs* so bored...', '😒 meh...', '🥱 *bored to death*', '💤 *dying of boredom*', '😐 nothing to do...'];

export const command: Command = {
  name: 'bored', aliases: ['boring', 'walang-gana'], description: 'Bored expression', category: 'roleplay',
  usage: 'bored', examples: ['bored'], cooldown: 3000,
  async execute({ reply }) { await reply(boreds[Math.floor(Math.random() * boreds.length)]); },
};
