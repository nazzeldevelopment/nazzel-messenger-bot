import type { Command } from '../../types/index.js';

const games = new Map<string, { number: number, attempts: number, maxAttempts: number }>();

export const command: Command = {
  name: 'numguess',
  aliases: ['ng', 'guessnumber', 'hulaan'],
  description: 'Guess the secret number between 1-100',
  category: 'games',
  usage: 'numguess | numguess <number> | numguess end',
  examples: ['numguess', 'numguess 50'],
  cooldown: 2000,

  async execute({ reply, args, event }) {
    const threadId = event.threadID;

    if (args[0] === 'end') {
      if (games.has(threadId)) {
        const game = games.get(threadId)!;
        games.delete(threadId);
        return reply(`🔢 Game ended! The number was: ${game.number}`);
      }
      return reply('❌ No active game.');
    }

    if (!args.length) {
      if (games.has(threadId)) {
        const game = games.get(threadId)!;
        return reply(`🔢 Game in progress!\nAttempts: ${game.attempts}/${game.maxAttempts}\n\nGuess: numguess <1-100>`);
      }
      
      const number = Math.floor(Math.random() * 100) + 1;
      games.set(threadId, { number, attempts: 0, maxAttempts: 10 });
      return reply('🔢 NUMBER GUESS\n\nI\'m thinking of a number 1-100!\nYou have 10 attempts.\n\nGuess: numguess <number>');
    }

    const game = games.get(threadId);
    if (!game) return reply('❌ No active game. Start with: numguess');

    const guess = parseInt(args[0]);
    if (isNaN(guess) || guess < 1 || guess > 100) return reply('❌ Enter a number between 1-100!');

    game.attempts++;

    if (guess === game.number) {
      games.delete(threadId);
      return reply(`🎉 CORRECT! The number was ${game.number}!\nAttempts: ${game.attempts}`);
    }

    if (game.attempts >= game.maxAttempts) {
      games.delete(threadId);
      return reply(`💀 Game Over! The number was: ${game.number}`);
    }

    const hint = guess < game.number ? '📈 Higher!' : '📉 Lower!';
    const remaining = game.maxAttempts - game.attempts;
    return reply(`${hint}\nAttempts: ${game.attempts}/${game.maxAttempts}\nRemaining: ${remaining}`);
  },
};
