import type { Command } from '../../types/index.js';
const words = ['LISTEN', 'SILENT', 'RESCUE', 'SECRET', 'PLANET', 'CASTLE', 'DANGER', 'GARDEN'];
const games = new Map<string, { original: string, scrambled: string }>();
export const command: Command = { name: 'anagram', aliases: ['ana'], description: 'Solve the anagram', category: 'games', usage: 'anagram | anagram <word>', examples: ['anagram', 'anagram listen'], cooldown: 3000,
  async execute({ reply, args, event }) {
    const tid = event.threadID;
    if (!args.length) { const word = words[Math.floor(Math.random() * words.length)]; const scrambled = word.split('').sort(() => Math.random() - 0.5).join(''); games.set(tid, { original: word, scrambled }); return reply(`🔤 ANAGRAM\n\n${scrambled}\n\nUnscramble: anagram <word>`); }
    const game = games.get(tid); if (!game) return reply('❌ Start a game first!');
    if (args[0].toUpperCase() === game.original) { games.delete(tid); await reply(`✅ CORRECT! The word was ${game.original}`); }
    else await reply('❌ Wrong! Try again!');
  },
};
