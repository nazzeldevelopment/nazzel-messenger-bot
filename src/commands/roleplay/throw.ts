import type { Command } from '../../types/index.js';
const items = ['🍕 pizza', '🎾 ball', '📱 phone', '💣 bomb (fake)', '🌸 flowers', '💧 water balloon', '🎂 cake'];
export const command: Command = { name: 'throw', aliases: ['hagis'], description: 'Throw something at someone', category: 'roleplay', usage: 'throw @mention', examples: ['throw @John'], cooldown: 5000,
  async execute({ reply, event }) { const target = Object.values(event.mentions || {})[0] || 'someone'; const item = items[Math.floor(Math.random() * items.length)]; await reply(`*throws ${item} at ${target}* 🎯`); },
};
