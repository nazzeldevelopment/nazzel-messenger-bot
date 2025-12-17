import type { Command } from '../../types/index.js';
const first = ['John', 'Jane', 'Alex', 'Sam', 'Max', 'Luna', 'Kai', 'Mia'];
const last = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
export const command: Command = { name: 'randomname', aliases: ['fakename'], description: 'Generate random name', category: 'fun', usage: 'randomname', examples: ['randomname'], cooldown: 3000,
  async execute({ reply }) { const f = first[Math.floor(Math.random() * first.length)]; const l = last[Math.floor(Math.random() * last.length)]; await reply(`👤 Name: ${f} ${l}`); },
};
