import type { Command } from '../../types/index.js';
const animals = ['🦅 Eagle - Visionary & Free', '🐺 Wolf - Loyal & Strong', '🦊 Fox - Clever & Cunning', '🦁 Lion - Brave & Leader', '🐻 Bear - Protective & Powerful', '🦋 Butterfly - Transformative', '🦉 Owl - Wise & Mysterious', '🐬 Dolphin - Playful & Smart'];
export const command: Command = { name: 'spiritanimal', aliases: ['myanimal'], description: 'Find your spirit animal', category: 'fun', usage: 'spiritanimal', examples: ['spiritanimal'], cooldown: 30000,
  async execute({ reply }) { await reply(`🌟 YOUR SPIRIT ANIMAL\n\n${animals[Math.floor(Math.random() * animals.length)]}`); },
};
