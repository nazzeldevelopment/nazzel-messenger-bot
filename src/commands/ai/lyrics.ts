import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'lyricgen',
  aliases: ['makelyrics', 'songwrite'],
  description: 'Generate song lyrics',
  category: 'ai',
  usage: 'lyricgen <theme>',
  examples: ['lyricgen heartbreak'],
  cooldown: 5000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ What should the song be about?');
    const theme = args.join(' ');
    await reply(`🎵 GENERATED LYRICS\n\nTheme: ${theme}\n\n[Verse 1]\nIn the ${theme} of my heart,\nI find where dreams start...\n\n[Chorus]\n${theme}, ${theme},\nYou mean everything to me...\n\n🎤 Keep singing!`);
  },
};
