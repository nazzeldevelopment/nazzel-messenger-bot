import type { Command, CommandContext } from '../../types/index.js';

const opinions = [
  "Pineapple on pizza is actually delicious",
  "Sleeping with socks on is comfortable",
  "Water is the best drink ever",
  "Mondays aren't that bad",
  "Cold pizza is better than hot pizza",
  "Rain is the best weather",
  "Cereal is better without milk",
  "Homework should be banned",
  "Morning people have it figured out",
  "Vanilla is better than chocolate",
  "Cats are better than dogs",
  "Summer is overrated",
  "Reading is more fun than video games",
  "Silence is golden",
  "Early bird gets the worm",
  "Black coffee is the best",
  "Sequels are never as good as originals",
  "Social media is toxic",
  "Being alone is peaceful",
  "Vegetables taste good",
];

const command: Command = {
  name: 'unpopularopinion',
  aliases: ['uo', 'hotttake', 'unpopular'],
  description: 'Get a random unpopular opinion',
  category: 'fun',
  usage: 'unpopularopinion',
  examples: ['unpopularopinion'],
  cooldown: 3000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    const opinion = opinions[Math.floor(Math.random() * opinions.length)];

    await reply(`╭─────────────────╮
│ 🔥 HOT TAKE
╰─────────────────╯

"${opinion}"

Do you agree? 🤔`);
  }
};

export default command;
