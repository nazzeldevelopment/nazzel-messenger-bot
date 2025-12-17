import type { Command } from '../../types/index.js';
const flirts = ['Are you a magician? Because whenever I look at you, everyone else disappears! 😍', 'Do you have a map? I just got lost in your eyes! 💕', 'Are you a parking ticket? Because you\'ve got fine written all over you! 😏', 'Is your name Google? Because you have everything I\'ve been searching for! 💖'];
export const command: Command = { name: 'flirt', aliases: ['pickup', 'ligaw'], description: 'Flirt with someone', category: 'roleplay', usage: 'flirt @mention', examples: ['flirt @John'], cooldown: 10000,
  async execute({ reply, event }) { const target = Object.values(event.mentions || {})[0] || 'you'; await reply(`💕 To ${target}:\n\n${flirts[Math.floor(Math.random() * flirts.length)]}`); },
};
