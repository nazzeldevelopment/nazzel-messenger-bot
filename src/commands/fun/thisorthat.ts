import type { Command } from '../../types/index.js';

const choices = [
  ['Coffee', 'Tea'],
  ['Morning person', 'Night owl'],
  ['Beach', 'Mountains'],
  ['Dogs', 'Cats'],
  ['Movies', 'TV Shows'],
  ['Summer', 'Winter'],
  ['Books', 'Movies'],
  ['Pizza', 'Burger'],
  ['Cake', 'Ice cream'],
  ['iPhone', 'Android'],
  ['Spotify', 'Apple Music'],
  ['Netflix', 'YouTube'],
  ['Online shopping', 'In-store shopping'],
  ['Early bird', 'Night owl'],
  ['Sweet', 'Savory'],
];

export const command: Command = {
  name: 'thisorthat',
  aliases: ['tot', 'choice'],
  description: 'This or That game',
  category: 'fun',
  usage: 'thisorthat',
  examples: ['thisorthat'],
  cooldown: 5000,
  async execute({ reply }) {
    const [a, b] = choices[Math.floor(Math.random() * choices.length)];
    await reply(`🤔 THIS OR THAT\n\n🅰️ ${a}\n\nOR\n\n🅱️ ${b}`);
  },
};
