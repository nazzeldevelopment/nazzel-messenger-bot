import type { Command } from '../../types/index.js';
const advice = ['Stay positive!', 'Never give up!', 'Be kind to others.', 'Learn from failures.', 'Take breaks when needed.', 'Celebrate small wins.', 'Trust the process.', 'Keep learning!'];
export const command: Command = { name: 'lifeadvice', aliases: ['lifetip'], description: 'Get life advice', category: 'fun', usage: 'lifeadvice', examples: ['lifeadvice'], cooldown: 5000,
  async execute({ reply }) { await reply(`💡 ${advice[Math.floor(Math.random() * advice.length)]}`); },
};
