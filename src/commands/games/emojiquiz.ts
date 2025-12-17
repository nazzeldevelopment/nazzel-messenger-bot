import type { Command } from '../../types/index.js';

const emojiPuzzles = [
  { emoji: '🦁👑', answer: 'lion king', hint: 'Disney movie about a lion' },
  { emoji: '🕷️🧑', answer: 'spider man', hint: 'Marvel superhero' },
  { emoji: '❄️👸', answer: 'frozen', hint: 'Let it go!' },
  { emoji: '🏠👆', answer: 'up', hint: 'Pixar movie with balloons' },
  { emoji: '🔍🐠', answer: 'finding nemo', hint: 'Lost clownfish' },
  { emoji: '🎃👻', answer: 'halloween', hint: 'October holiday' },
  { emoji: '🦈👊', answer: 'shark tale', hint: 'Fish in the mob' },
  { emoji: '🧜‍♀️🌊', answer: 'little mermaid', hint: 'Ariel' },
  { emoji: '🦷💫', answer: 'tooth fairy', hint: 'Collects teeth' },
  { emoji: '🏰🌹', answer: 'beauty and the beast', hint: 'Tale as old as time' },
  { emoji: '🐀👨‍🍳', answer: 'ratatouille', hint: 'Rat that cooks' },
  { emoji: '🐢🥷', answer: 'ninja turtles', hint: 'Cowabunga!' },
  { emoji: '🧸🍯', answer: 'winnie the pooh', hint: 'Oh bother!' },
  { emoji: '🌈🦄', answer: 'unicorn', hint: 'Magical horse' },
  { emoji: '🎄🎅', answer: 'christmas', hint: 'December holiday' },
];

const games = new Map<string, { puzzle: typeof emojiPuzzles[0], score: number }>();

export const command: Command = {
  name: 'emojiquiz',
  aliases: ['eq', 'emojiword', 'pictionary'],
  description: 'Guess the word from emoji clues',
  category: 'games',
  usage: 'emojiquiz | emojiquiz <answer> | emojiquiz hint',
  examples: ['emojiquiz', 'emojiquiz lion king'],
  cooldown: 3000,

  async execute({ reply, args, event }) {
    const threadId = event.threadID;

    if (!args.length) {
      const puzzle = emojiPuzzles[Math.floor(Math.random() * emojiPuzzles.length)];
      const game = games.get(threadId) || { puzzle, score: 0 };
      game.puzzle = puzzle;
      games.set(threadId, game);
      
      return reply(`🎯 EMOJI QUIZ\n\n${puzzle.emoji}\n\nWhat does this represent?\n\nAnswer: emojiquiz <answer>\nNeed help? emojiquiz hint\nScore: ${game.score}`);
    }

    const game = games.get(threadId);
    if (!game) return reply('❌ No active game. Start with: emojiquiz');

    if (args[0] === 'hint') {
      return reply(`💡 Hint: ${game.puzzle.hint}`);
    }

    const answer = args.join(' ').toLowerCase();

    if (answer === game.puzzle.answer || game.puzzle.answer.includes(answer)) {
      game.score++;
      const newPuzzle = emojiPuzzles[Math.floor(Math.random() * emojiPuzzles.length)];
      game.puzzle = newPuzzle;
      
      return reply(`✅ CORRECT! +1 point\n\n🎯 NEXT PUZZLE\n\n${newPuzzle.emoji}\n\nScore: ${game.score}`);
    }

    return reply(`❌ Wrong! Try again!\n\n${game.puzzle.emoji}`);
  },
};
