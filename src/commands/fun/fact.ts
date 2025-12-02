import type { Command } from '../../types/index.js';

const facts = [
  "Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that was still edible!",
  "Octopuses have three hearts, nine brains, and blue blood.",
  "A group of flamingos is called a 'flamboyance'.",
  "The shortest war in history lasted 38-45 minutes between Britain and Zanzibar in 1896.",
  "Bananas are berries, but strawberries aren't.",
  "The Eiffel Tower can grow 15 cm taller during hot summer days due to thermal expansion.",
  "A day on Venus is longer than a year on Venus.",
  "Cows have best friends and get stressed when separated.",
  "The Philippines is made up of 7,641 islands.",
  "The fingerprints of koalas are virtually indistinguishable from human fingerprints.",
  "An apple, onion, and potato all taste the same if you eat them with your nose plugged.",
  "There are more possible iterations of a game of chess than atoms in the observable universe.",
  "The inventor of the Pringles can is buried in one.",
  "A jiffy is an actual unit of time: 1/100th of a second.",
  "The moon has moonquakes.",
  "Hot water freezes faster than cold water. This is called the Mpemba effect.",
  "The Philippines was the first country in Southeast Asia to gain independence.",
  "Jeepneys in the Philippines were originally made from leftover US military jeeps.",
  "Mount Pinatubo's 1991 eruption was the second-largest volcanic eruption of the 20th century.",
  "The tarsier, one of the world's smallest primates, is found in the Philippines.",
  "Chocolate Lake in the Philippines changes color based on the season.",
  "The Philippines is home to the world's largest pearl, the Pearl of Lao Tzu.",
];

export const command: Command = {
  name: 'fact',
  aliases: ['facts', 'funfact', 'didyouknow'],
  description: 'Get a random interesting fact',
  category: 'fun',
  usage: 'fact',
  examples: ['fact'],
  cooldown: 5,

  async execute({ reply }) {
    const fact = facts[Math.floor(Math.random() * facts.length)];
    await reply(`📚 *Did You Know?*\n\n${fact}`);
  },
};
