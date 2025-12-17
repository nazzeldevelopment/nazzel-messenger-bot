import type { Command } from '../../types/index.js';
const boyNames = ['Liam', 'Noah', 'James', 'Lucas', 'Ethan', 'Mason', 'Oliver', 'Aiden', 'Elijah', 'Leo'];
const girlNames = ['Olivia', 'Emma', 'Sophia', 'Mia', 'Ava', 'Luna', 'Chloe', 'Lily', 'Zoe', 'Aria'];
export const command: Command = { name: 'babyname', aliases: ['babynamegen'], description: 'Generate baby names', category: 'ai', usage: 'babyname [boy/girl]', examples: ['babyname', 'babyname girl'], cooldown: 5000,
  async execute({ reply, args }) { const gender = args[0]?.toLowerCase(); let name; if (gender === 'boy') name = boyNames[Math.floor(Math.random() * boyNames.length)]; else if (gender === 'girl') name = girlNames[Math.floor(Math.random() * girlNames.length)]; else name = [...boyNames, ...girlNames][Math.floor(Math.random() * 20)]; await reply(`👶 Baby Name Suggestion: ${name}`); },
};
