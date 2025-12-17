import type { Command } from '../../types/index.js';

const facts = [
  'Honey never spoils. Archaeologists have found 3000-year-old honey that was still edible!',
  'A group of flamingos is called a "flamboyance".',
  'Octopuses have three hearts and blue blood.',
  'Bananas are berries, but strawberries aren\'t.',
  'The Eiffel Tower can grow up to 6 inches during summer due to heat expansion.',
  'A day on Venus is longer than a year on Venus.',
  'Cows have best friends and get stressed when separated.',
  'The shortest war in history lasted 38 to 45 minutes.',
  'Dolphins have names for each other.',
  'A cloud can weigh more than a million pounds.',
  'Humans share 50% of their DNA with bananas.',
  'The inventor of the Pringles can is buried in one.',
];

export const command: Command = {
  name: 'funfact',
  aliases: ['ff', 'randomfact'],
  description: 'Get a random fun fact',
  category: 'fun',
  usage: 'funfact',
  examples: ['funfact'],
  cooldown: 5000,
  async execute({ reply }) {
    const fact = facts[Math.floor(Math.random() * facts.length)];
    await reply(`🧠 FUN FACT\n\n${fact}`);
  },
};
