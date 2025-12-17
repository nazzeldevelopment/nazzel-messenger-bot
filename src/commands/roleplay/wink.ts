import type { Command } from '../../types/index.js';
const winks = ['😉 *winks*', '😜 *playful wink*', '😏 *smirks and winks*', '✨ *cute wink* 😉', '💫 *wink wink*'];
export const command: Command = { name: 'wink', aliases: ['kindat'], description: 'Wink at someone', category: 'roleplay', usage: 'wink @mention', examples: ['wink @John'], cooldown: 3000,
  async execute({ reply, event }) { const target = Object.values(event.mentions || {})[0] || 'you'; await reply(`${winks[Math.floor(Math.random() * winks.length)]} at ${target}`); },
};
