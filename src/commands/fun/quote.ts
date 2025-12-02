import type { Command } from '../../types/index.js';

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
  { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "If you really look closely, most overnight successes took a long time.", author: "Steve Jobs" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It's not whether you get knocked down, it's whether you get up.", author: "Vince Lombardi" },
  { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
  { text: "Try not to become a person of success, but rather try to become a person of value.", author: "Albert Einstein" },
  { text: "Great minds discuss ideas; average minds discuss events; small minds discuss people.", author: "Eleanor Roosevelt" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "Kung gusto mo, maraming paraan. Kung ayaw mo, maraming dahilan.", author: "Filipino Proverb" },
  { text: "Ang hindi marunong lumingon sa pinanggalingan ay hindi makararating sa paroroonan.", author: "Jose Rizal" },
  { text: "Walang mahirap kung may tiyaga.", author: "Filipino Proverb" },
  { text: "Ang taong nagigipit, sa patalim kumakapit.", author: "Filipino Proverb" },
];

export const command: Command = {
  name: 'quote',
  aliases: ['q', 'quotes', 'inspire', 'motivation'],
  description: 'Get a random motivational quote',
  category: 'fun',
  usage: 'quote',
  examples: ['quote'],
  cooldown: 5,

  async execute({ reply }) {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    await reply(`💭 *Motivational Quote*\n\n"${quote.text}"\n\n— ${quote.author}`);
  },
};
