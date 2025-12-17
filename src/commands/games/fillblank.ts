import type { Command, CommandContext } from '../../types/index.js';

const blanks = [
  { sentence: 'The ____ jumped over the moon', answer: 'cow' },
  { sentence: 'Twinkle twinkle little ____', answer: 'star' },
  { sentence: 'An ____ a day keeps the doctor away', answer: 'apple' },
  { sentence: 'The early ____ catches the worm', answer: 'bird' },
  { sentence: 'A picture is worth a thousand ____', answer: 'words' },
  { sentence: 'Don\'t cry over spilled ____', answer: 'milk' },
  { sentence: 'The ____ of gravity was discovered by Newton', answer: 'law' },
  { sentence: 'Rome wasn\'t built in a ____', answer: 'day' },
  { sentence: 'When life gives you lemons, make ____', answer: 'lemonade' },
  { sentence: 'Practice makes ____', answer: 'perfect' },
  { sentence: 'Actions speak louder than ____', answer: 'words' },
  { sentence: 'The pen is mightier than the ____', answer: 'sword' },
  { sentence: 'All that glitters is not ____', answer: 'gold' },
  { sentence: 'Beauty is in the ____ of the beholder', answer: 'eye' },
  { sentence: 'Time is ____', answer: 'money' },
];

const command: Command = {
  name: 'fillblank',
  aliases: ['blank', 'fillintheblanks', 'missingword'],
  description: 'Fill in the blank word game',
  category: 'games',
  usage: 'fillblank',
  examples: ['fillblank'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    
    const puzzle = blanks[Math.floor(Math.random() * blanks.length)];

    await reply(`╭─────────────────╮
│ ✏️ FILL BLANK
╰─────────────────╯

"${puzzle.sentence}"

What's the missing word?

(Answer: ${puzzle.answer})`);
  }
};

export default command;
