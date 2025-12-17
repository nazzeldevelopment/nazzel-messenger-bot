import type { Command } from '../../types/index.js';

const scenarios = [
  'What if you could fly?',
  'What if money didn\'t exist?',
  'What if you could read minds?',
  'What if you woke up as the opposite gender?',
  'What if you could time travel?',
  'What if animals could talk?',
  'What if you never had to sleep?',
  'What if you could be invisible?',
  'What if you lived forever?',
  'What if you could speak every language?',
  'What if you had unlimited money?',
  'What if you could teleport?',
];

export const command: Command = {
  name: 'whatif',
  aliases: ['hypothetical', 'imagine'],
  description: 'Get a What If scenario',
  category: 'fun',
  usage: 'whatif',
  examples: ['whatif'],
  cooldown: 5000,
  async execute({ reply }) {
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    await reply(`💭 WHAT IF\n\n${scenario}`);
  },
};
