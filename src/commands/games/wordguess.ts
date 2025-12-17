import type { Command } from '../../types/index.js';
const words = ['APPLE', 'MUSIC', 'PHONE', 'WATER', 'HAPPY', 'DANCE'];
const hints = { APPLE: 'A fruit', MUSIC: 'You listen to this', PHONE: 'Communication device', WATER: 'H2O', HAPPY: 'Positive emotion', DANCE: 'Move to music' };
const games = new Map<string, { word: string }>();
export const command: Command = { name: 'wordguess', aliases: ['wg'], description: 'Guess the word', category: 'games', usage: 'wordguess | wordguess <word>', examples: ['wordguess', 'wordguess apple'], cooldown: 5000,
  async execute({ reply, args, event }) { const tid = event.threadID; if (!args.length) { const word = words[Math.floor(Math.random() * words.length)]; games.set(tid, { word }); return reply(`🔮 WORD GUESS\n\nHint: ${hints[word as keyof typeof hints]}\nLetters: ${word.length}`); } const game = games.get(tid); if (!game) return reply('❌ Start first!'); if (args[0].toUpperCase() === game.word) { games.delete(tid); await reply(`🎉 CORRECT! The word was ${game.word}`); } else await reply('❌ Wrong!'); },
};
