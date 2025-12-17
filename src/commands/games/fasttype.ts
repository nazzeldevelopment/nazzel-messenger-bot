import type { Command } from '../../types/index.js';
const words = ['quick', 'brown', 'fox', 'jumps', 'lazy', 'dog', 'hello', 'world', 'computer', 'keyboard'];
export const command: Command = { name: 'fasttype', aliases: ['ft'], description: 'Fast typing challenge', category: 'games', usage: 'fasttype', examples: ['fasttype'], cooldown: 5000,
  async execute({ reply }) { const word = words[Math.floor(Math.random() * words.length)]; await reply(`⌨️ FAST TYPE\n\nType this word fast:\n\n"${word.toUpperCase()}"\n\nUse: typingrace "${word}"`); },
};
