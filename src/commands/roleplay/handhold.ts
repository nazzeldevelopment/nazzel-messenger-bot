import type { Command } from '../../types/index.js';
const holds = ['*holds {target}\'s hand* 🤝', '*interlocks fingers with {target}* 💕', '*gently holds hands with {target}* ✨', '*reaches for {target}\'s hand* 🥺'];
export const command: Command = { name: 'handhold', aliases: ['holdhand', 'hawak'], description: 'Hold someone\'s hand', category: 'roleplay', usage: 'handhold @mention', examples: ['handhold @John'], cooldown: 3000,
  async execute({ reply, event }) { const target = Object.values(event.mentions || {})[0] || 'someone'; await reply(holds[Math.floor(Math.random() * holds.length)].replace('{target}', target as string)); },
};
