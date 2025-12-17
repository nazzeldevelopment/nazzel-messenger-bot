import type { Command, CommandContext } from '../../types/index.js';

const countries = [
  { flag: '🇯🇵', name: 'Japan', hints: ['Land of the Rising Sun', 'Home of sushi and anime'] },
  { flag: '🇺🇸', name: 'USA', hints: ['Land of the Free', 'Has 50 states'] },
  { flag: '🇫🇷', name: 'France', hints: ['Eiffel Tower is here', 'Famous for croissants'] },
  { flag: '🇧🇷', name: 'Brazil', hints: ['Amazon Rainforest', 'Famous for Carnival'] },
  { flag: '🇮🇳', name: 'India', hints: ['Taj Mahal is here', 'Largest democracy'] },
  { flag: '🇦🇺', name: 'Australia', hints: ['Land Down Under', 'Has kangaroos'] },
  { flag: '🇨🇦', name: 'Canada', hints: ['Known for maple syrup', 'Second largest country'] },
  { flag: '🇩🇪', name: 'Germany', hints: ['Oktoberfest origin', 'Famous for cars'] },
  { flag: '🇮🇹', name: 'Italy', hints: ['Pizza and pasta origin', 'Has the Colosseum'] },
  { flag: '🇲🇽', name: 'Mexico', hints: ['Tacos and burritos', 'Ancient Mayan ruins'] },
  { flag: '🇰🇷', name: 'South Korea', hints: ['K-Pop origin', 'Technology hub'] },
  { flag: '🇪🇬', name: 'Egypt', hints: ['Has pyramids', 'Land of pharaohs'] },
  { flag: '🇬🇧', name: 'UK', hints: ['Home of Big Ben', 'Royal family lives here'] },
  { flag: '🇨🇳', name: 'China', hints: ['Great Wall is here', 'Most populous country'] },
  { flag: '🇵🇭', name: 'Philippines', hints: ['7,000+ islands', 'Famous for beaches'] },
];

const command: Command = {
  name: 'guesscountry',
  aliases: ['countryquiz', 'flaggame', 'whatcountry'],
  description: 'Guess the country from the flag',
  category: 'games',
  usage: 'guesscountry',
  examples: ['guesscountry'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    const country = countries[Math.floor(Math.random() * countries.length)];
    const hint = country.hints[Math.floor(Math.random() * country.hints.length)];

    await reply(`╭─────────────────╮
│ 🌍 GUESS COUNTRY
╰─────────────────╯

Flag: ${country.flag}

Hint: ${hint}

What country is this?

(Answer: ${country.name})`);
  }
};

export default command;
