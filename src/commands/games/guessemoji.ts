import type { Command, CommandContext } from '../../types/index.js';

const puzzles = [
  { emojis: '🍕+🏠', answer: 'Pizza Hut' },
  { emojis: '🌟+⚔️', answer: 'Star Wars' },
  { emojis: '🕷️+🧔', answer: 'Spider-Man' },
  { emojis: '🦁+👑', answer: 'Lion King' },
  { emojis: '❄️+👸', answer: 'Frozen' },
  { emojis: '🎮+🪑', answer: 'Gaming Chair' },
  { emojis: '🌊+🦈', answer: 'Shark' },
  { emojis: '☀️+🌻', answer: 'Sunflower' },
  { emojis: '🍎+📱', answer: 'Apple iPhone' },
  { emojis: '🎂+📅', answer: 'Birthday' },
  { emojis: '💀+☠️', answer: 'Skeleton' },
  { emojis: '🌈+🦄', answer: 'Rainbow Unicorn' },
  { emojis: '🔥+👨‍🚒', answer: 'Firefighter' },
  { emojis: '⚽+🏟️', answer: 'Football Stadium' },
  { emojis: '🎸+⭐', answer: 'Rock Star' },
  { emojis: '🍔+👑', answer: 'Burger King' },
  { emojis: '☕+👶', answer: 'Baby' },
  { emojis: '🌙+🐺', answer: 'Werewolf' },
  { emojis: '🎄+🎅', answer: 'Christmas' },
  { emojis: '💎+💍', answer: 'Diamond Ring' },
];

const command: Command = {
  name: 'guessemoji',
  aliases: ['emojipuzzle', 'emojiriddle', 'whatisit'],
  description: 'Guess what the emojis represent',
  category: 'games',
  usage: 'guessemoji',
  examples: ['guessemoji'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

    await reply(`╭─────────────────╮
│ 🧩 EMOJI PUZZLE
╰─────────────────╯

${puzzle.emojis}

What does this represent?

(Answer: ${puzzle.answer})`);
  }
};

export default command;
