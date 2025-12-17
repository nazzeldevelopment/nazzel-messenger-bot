import type { Command } from '../../types/index.js';
const jokes = ["Why don't scientists trust atoms? Because they make up everything!", "I'm reading a book about anti-gravity. It's impossible to put down!", "Why did the scarecrow win an award? He was outstanding in his field!", "I used to hate facial hair, but then it grew on me.", "What do you call a fake noodle? An impasta!"];
export const command: Command = { name: 'dadjoke', aliases: ['dad'], description: 'Get a dad joke', category: 'fun', usage: 'dadjoke', examples: ['dadjoke'], cooldown: 5000,
  async execute({ reply }) { await reply(`👨 DAD JOKE\n\n${jokes[Math.floor(Math.random() * jokes.length)]}`); },
};
