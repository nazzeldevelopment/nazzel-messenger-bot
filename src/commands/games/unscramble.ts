import type { Command, CommandContext } from '../../types/index.js';

const words = [
  'apple', 'banana', 'orange', 'computer', 'keyboard',
  'mouse', 'screen', 'phone', 'music', 'video',
  'games', 'player', 'friend', 'family', 'school',
  'coffee', 'pizza', 'burger', 'chicken', 'water',
  'flower', 'garden', 'sunset', 'ocean', 'mountain',
  'dragon', 'castle', 'knight', 'wizard', 'princess',
];

function scramble(word: string): string {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const scrambled = arr.join('');
  return scrambled === word ? scramble(word) : scrambled;
}

const command: Command = {
  name: 'unscramble',
  aliases: ['scramble', 'wordscramble', 'jumble'],
  description: 'Unscramble the word game',
  category: 'games',
  usage: 'unscramble',
  examples: ['unscramble'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    
    const word = words[Math.floor(Math.random() * words.length)];
    const scrambled = scramble(word);

    await reply(`╭─────────────────╮
│ 🔀 UNSCRAMBLE
╰─────────────────╯

Scrambled: ${scrambled.toUpperCase()}

What word is this?

Hint: ${word.length} letters

(Answer: ${word})`);
  }
};

export default command;
