import type { Command, CommandContext } from '../../types/index.js';

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Be the change you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "In three words I can sum up everything I've learned about life: it goes on.", author: "Robert Frost" },
];

const command: Command = {
  name: 'inspirequote',
  aliases: ['inspire', 'iq', 'wisdom'],
  description: 'Get an inspirational quote',
  category: 'ai',
  usage: 'inspirequote',
  examples: ['inspirequote'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;

    const quote = quotes[Math.floor(Math.random() * quotes.length)];

    await reply(`╭─────────────────╮
│ 💡 INSPIRATION
╰─────────────────╯

"${quote.text}"

— ${quote.author} ✨`);
  }
};

export default command;
