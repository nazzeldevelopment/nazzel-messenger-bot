import type { Command } from '../../types/index.js';

const characters = [
  { name: 'Superman', hints: ['superhero', 'flies', 'cape', 'krypton', 'clark kent'] },
  { name: 'Pikachu', hints: ['pokemon', 'yellow', 'electric', 'ash', 'mouse'] },
  { name: 'Harry Potter', hints: ['wizard', 'hogwarts', 'scar', 'magic', 'voldemort'] },
  { name: 'SpongeBob', hints: ['sponge', 'bikini bottom', 'pineapple', 'patrick', 'krabby patty'] },
  { name: 'Mickey Mouse', hints: ['disney', 'mouse', 'ears', 'minnie', 'cartoon'] },
  { name: 'Darth Vader', hints: ['star wars', 'dark side', 'vader', 'luke', 'sith'] },
  { name: 'Mario', hints: ['nintendo', 'plumber', 'mushroom', 'princess', 'luigi'] },
  { name: 'Elsa', hints: ['frozen', 'ice', 'princess', 'let it go', 'anna'] },
  { name: 'Batman', hints: ['gotham', 'bat', 'dark knight', 'joker', 'wayne'] },
  { name: 'Goku', hints: ['dragon ball', 'saiyan', 'kamehameha', 'vegeta', 'super'] },
];

const games = new Map<string, { character: typeof characters[0], hintsGiven: number, guesses: number }>();

export const command: Command = {
  name: 'akinator',
  aliases: ['aki', 'guesswho'],
  description: 'Guess the character from hints',
  category: 'games',
  usage: 'akinator | akinator hint | akinator <guess>',
  examples: ['akinator', 'akinator hint', 'akinator superman'],
  cooldown: 3000,

  async execute({ reply, args, event }) {
    const threadId = event.threadID;

    if (!args.length) {
      if (games.has(threadId)) {
        const game = games.get(threadId)!;
        return reply(`🔮 AKINATOR\n\nGuesses: ${game.guesses}\nHints used: ${game.hintsGiven}/5\n\nGuess: akinator <name>\nNeed help? akinator hint`);
      }

      const character = characters[Math.floor(Math.random() * characters.length)];
      games.set(threadId, { character, hintsGiven: 0, guesses: 0 });
      
      return reply(`🔮 AKINATOR\n\nI'm thinking of a character...\n\nGuess: akinator <name>\nNeed help? akinator hint`);
    }

    const game = games.get(threadId);
    if (!game) return reply('❌ No active game. Start with: akinator');

    if (args[0] === 'hint') {
      if (game.hintsGiven >= 5) return reply('❌ No more hints available!');
      
      const hint = game.character.hints[game.hintsGiven];
      game.hintsGiven++;
      
      return reply(`💡 Hint ${game.hintsGiven}/5: ${hint.toUpperCase()}`);
    }

    game.guesses++;
    const guess = args.join(' ').toLowerCase();

    if (guess === game.character.name.toLowerCase() || game.character.name.toLowerCase().includes(guess)) {
      games.delete(threadId);
      return reply(`🎉 CORRECT!\n\nIt was ${game.character.name}!\nGuesses: ${game.guesses}\nHints used: ${game.hintsGiven}`);
    }

    return reply(`❌ Not ${args.join(' ')}!\n\nGuesses: ${game.guesses}\nTry again or use: akinator hint`);
  },
};
