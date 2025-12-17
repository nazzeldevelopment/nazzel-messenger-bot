import type { Command, CommandContext } from '../../types/index.js';

const affirmations = [
  "You are worthy of love and respect.",
  "You have the power to create positive change.",
  "Your potential is limitless.",
  "You are enough, just as you are.",
  "Every day, you are getting stronger.",
  "You deserve happiness and success.",
  "Your unique qualities make you special.",
  "You are capable of achieving your dreams.",
  "You bring value to those around you.",
  "Your journey is valid and important.",
  "You have overcome challenges before, you can do it again.",
  "You are resilient and brave.",
  "Your feelings matter and are valid.",
  "You are making a difference in the world.",
  "You are growing and improving every day.",
  "You are worthy of all the good things life offers.",
  "Your mistakes don't define you, your growth does.",
  "You have so much to offer the world.",
  "You are loved more than you know.",
  "Today is full of possibilities for you.",
];

const command: Command = {
  name: 'affirmations',
  aliases: ['affirm', 'dailyaffirm', 'positivity'],
  description: 'Get a positive daily affirmation',
  category: 'ai',
  usage: 'affirmations',
  examples: ['affirmations'],
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;

    const affirmation = affirmations[Math.floor(Math.random() * affirmations.length)];

    await reply(`╭─────────────────╮
│ 💝 AFFIRMATION
╰─────────────────╯

"${affirmation}"

🌟 Believe in yourself!`);
  }
};

export default command;
