import type { Command } from '../../types/index.js';
const countries = ['🇯🇵 Japan', '🇵🇭 Philippines', '🇺🇸 USA', '🇰🇷 South Korea', '🇫🇷 France', '🇧🇷 Brazil', '🇦🇺 Australia', '🇮🇹 Italy'];
export const command: Command = { name: 'randomcountry', aliases: ['country'], description: 'Random country', category: 'fun', usage: 'randomcountry', examples: ['randomcountry'], cooldown: 3000,
  async execute({ reply }) { await reply(`🌍 ${countries[Math.floor(Math.random() * countries.length)]}`); },
};
