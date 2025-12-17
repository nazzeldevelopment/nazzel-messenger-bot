import type { Command } from '../../types/index.js';

const storyStarters = [
  'Once upon a time, in a land far away, there was a {topic}...',
  'Long ago, when magic still existed, a young {topic} discovered something extraordinary...',
  'In a world where {topic} ruled, one hero dared to be different...',
  'The legend of {topic} began on a stormy night...',
];

export const command: Command = {
  name: 'story',
  aliases: ['tellstory', 'kwento'],
  description: 'Generate a short story',
  category: 'ai',
  usage: 'story <theme>',
  examples: ['story dragon'],
  cooldown: 5000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ What should the story be about?');
    const topic = args.join(' ');
    const starter = storyStarters[Math.floor(Math.random() * storyStarters.length)];
    const story = starter.replace(/{topic}/g, topic);
    await reply(`📖 STORY\n\n${story}\n\n...and the adventure continues!\n\n🌟 Theme: ${topic}`);
  },
};
