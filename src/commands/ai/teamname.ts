import type { Command } from '../../types/index.js';
const adjectives = ['Fierce', 'Mighty', 'Epic', 'Thunder', 'Shadow', 'Storm', 'Blazing', 'Cosmic'];
const nouns = ['Warriors', 'Dragons', 'Legends', 'Phoenix', 'Titans', 'Knights', 'Wolves', 'Eagles'];
export const command: Command = { name: 'teamname', aliases: ['teamgen'], description: 'Generate team name', category: 'ai', usage: 'teamname', examples: ['teamname'], cooldown: 5000,
  async execute({ reply }) { const adj = adjectives[Math.floor(Math.random() * adjectives.length)]; const noun = nouns[Math.floor(Math.random() * nouns.length)]; await reply(`⚔️ Team Name: ${adj} ${noun}`); },
};
