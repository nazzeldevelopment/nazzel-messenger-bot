import type { Command } from '../../types/index.js';
const books = ['Harry Potter', '1984', 'The Great Gatsby', 'Pride and Prejudice', 'To Kill a Mockingbird', 'The Hobbit', 'Dune', 'The Alchemist'];
export const command: Command = { name: 'randombook', aliases: ['bookrecommend'], description: 'Random book recommendation', category: 'fun', usage: 'randombook', examples: ['randombook'], cooldown: 5000,
  async execute({ reply }) { await reply(`📚 Read: ${books[Math.floor(Math.random() * books.length)]}`); },
};
