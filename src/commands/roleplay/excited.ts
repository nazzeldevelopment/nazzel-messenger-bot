import type { Command } from '../../types/index.js';

const excitements = ['🤩 YAAAY!', '🎉 SO EXCITED!', '✨ *jumping with joy*', '🥳 WOOHOO!', '💫 *can\'t contain excitement*'];

export const command: Command = {
  name: 'excited', aliases: ['yay', 'happy'], description: 'Excited expression', category: 'roleplay',
  usage: 'excited', examples: ['excited'], cooldown: 3000,
  async execute({ reply }) { await reply(excitements[Math.floor(Math.random() * excitements.length)]); },
};
