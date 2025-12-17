import type { Command, CommandContext } from '../../types/index.js';

const questions = [
  "Would you rather be able to fly or be invisible?",
  "Would you rather have unlimited money or unlimited love?",
  "Would you rather live in the past or the future?",
  "Would you rather be famous or rich?",
  "Would you rather have no internet or no friends?",
  "Would you rather eat only pizza or only burgers forever?",
  "Would you rather be a superhero or a supervillain?",
  "Would you rather live alone or with 10 roommates?",
  "Would you rather have super strength or super speed?",
  "Would you rather be too hot or too cold forever?",
  "Would you rather be able to read minds or see the future?",
  "Would you rather have no phone or no computer?",
  "Would you rather live in space or underwater?",
  "Would you rather be a genius or be incredibly lucky?",
  "Would you rather never age or never get sick?",
  "Would you rather have free WiFi or free food everywhere?",
  "Would you rather be able to talk to animals or speak all languages?",
  "Would you rather have no homework or no chores?",
  "Would you rather be famous on YouTube or TikTok?",
  "Would you rather have a rewind button or a pause button for life?",
];

const command: Command = {
  name: 'wouldyou',
  aliases: ['wy', 'wyr2'],
  description: 'Get a would you rather question',
  category: 'fun',
  usage: 'wouldyou',
  examples: ['wouldyou'],
  cooldown: 3000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    const question = questions[Math.floor(Math.random() * questions.length)];

    await reply(`╭─────────────────╮
│ 🤔 WOULD YOU...
╰─────────────────╯

${question}

Reply with your choice! 👆`);
  }
};

export default command;
