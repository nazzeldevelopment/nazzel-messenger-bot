import type { Command } from '../../types/index.js';

const templates = [
  'Roses are red,\nViolets are blue,\n{topic} is amazing,\nAnd so are you!',
  'In the realm of {topic},\nWonders never cease,\nA world of mystery,\nAnd inner peace.',
  'Through the {topic} I wander,\nSearching high and low,\nFor answers to questions,\nThat only the wise know.',
];

export const command: Command = {
  name: 'poem',
  aliases: ['poetry', 'tula'],
  description: 'Generate a poem about a topic',
  category: 'ai',
  usage: 'poem <topic>',
  examples: ['poem love'],
  cooldown: 5000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ What should the poem be about?');
    const topic = args.join(' ');
    const template = templates[Math.floor(Math.random() * templates.length)];
    const poem = template.replace(/{topic}/g, topic);
    await reply(`📜 POEM\n\n${poem}\n\n✨ Inspired by: ${topic}`);
  },
};
