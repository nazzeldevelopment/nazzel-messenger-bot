import type { Command, CommandContext } from '../../types/index.js';

const categories = [
  { category: 'Animals', words: ['lion', 'tiger', 'elephant', 'giraffe', 'zebra'] },
  { category: 'Fruits', words: ['apple', 'banana', 'mango', 'orange', 'grape'] },
  { category: 'Countries', words: ['japan', 'france', 'brazil', 'canada', 'italy'] },
  { category: 'Colors', words: ['red', 'blue', 'green', 'yellow', 'purple'] },
  { category: 'Sports', words: ['soccer', 'basketball', 'tennis', 'golf', 'swimming'] },
];

const command: Command = {
  name: 'findword',
  aliases: ['categoryword', 'nameword', 'thinkword'],
  description: 'Name words from a category',
  category: 'games',
  usage: 'findword',
  examples: ['findword'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const startLetter = cat.words[Math.floor(Math.random() * cat.words.length)][0].toUpperCase();

    await reply(`╭─────────────────╮
│ 🔍 FIND WORD
╰─────────────────╯

Category: ${cat.category}
Starting Letter: ${startLetter}

Name something in this category that starts with "${startLetter}"!

Examples: ${cat.words.filter(w => w[0].toUpperCase() === startLetter).join(', ')}`);
  }
};

export default command;
