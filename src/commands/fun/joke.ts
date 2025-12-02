import type { Command } from '../../types/index.js';

const jokes = [
  "Bakit hindi marunong magsinungaling ang kalendaryo? Dahil laging may petsa!",
  "Ano ang tawag sa isang matandang computer? Lolotop!",
  "Bakit malungkot ang math book? Kasi puro problema ang laman!",
  "Ano ang paborito ni Superman na parte ng joke? The punchline!",
  "Bakit ayaw ng skeleton pumunta sa party? Walang siyang kasama... I mean, body!",
  "Ano ang tawag sa baboy na karate master? Pork chop!",
  "Bakit malungkot ang electric fan? Kasi puro ikot lang ang buhay niya!",
  "Ano ang tawag sa lamok na pilosopo? Dengue-nist!",
  "Bakit nagagalit ang pencil? Kasi palaging napaparusahan... este, napapatasa!",
  "Ano ang sabi ng isang wall sa kabilang wall? Meet tayo sa corner!",
  "Why don't scientists trust atoms? Because they make up everything!",
  "What do you call a fake noodle? An impasta!",
  "Why did the scarecrow win an award? He was outstanding in his field!",
  "What do you call a bear with no teeth? A gummy bear!",
  "Why don't eggs tell jokes? They'd crack each other up!",
  "What do you call a fish without eyes? A fsh!",
  "Why did the coffee file a police report? It got mugged!",
  "What do you call a sleeping dinosaur? A dino-snore!",
  "Why can't you give Elsa a balloon? Because she will let it go!",
  "What do you call a boomerang that won't come back? A stick!",
];

export const command: Command = {
  name: 'joke',
  aliases: ['j', 'jokes', 'biro'],
  description: 'Get a random joke to brighten your day',
  category: 'fun',
  usage: 'joke',
  examples: ['joke'],
  cooldown: 5,

  async execute({ reply }) {
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    await reply(`😂 *Random Joke*\n\n${joke}`);
  },
};
