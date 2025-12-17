import type { Command } from '../../types/index.js';
const punches = ['*punches {target} playfully* 👊', '*jabs {target}* pow! 💥', '*gives {target} a friendly punch* 🤜', '*punches {target}* ouch! 😆'];
export const command: Command = { name: 'punch', aliases: ['suntok'], description: 'Punch someone playfully', category: 'roleplay', usage: 'punch @mention', examples: ['punch @John'], cooldown: 5000,
  async execute({ reply, event }) { const target = Object.values(event.mentions || {})[0] || 'the air'; await reply(punches[Math.floor(Math.random() * punches.length)].replace('{target}', target as string)); },
};
