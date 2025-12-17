import type { Command } from '../../types/index.js';

const statements = [
  'Never have I ever stayed up all night.',
  'Never have I ever pretended to be sick to skip school.',
  'Never have I ever eaten an entire pizza by myself.',
  'Never have I ever talked to myself.',
  'Never have I ever danced alone in my room.',
  'Never have I ever cried during a movie.',
  'Never have I ever forgotten someone\'s name right after meeting them.',
  'Never have I ever sent a text to the wrong person.',
  'Never have I ever laughed so hard I cried.',
  'Never have I ever been on a plane.',
  'Never have I ever had a crush on a fictional character.',
  'Never have I ever binged an entire series in one day.',
];

export const command: Command = {
  name: 'neverhaveiever',
  aliases: ['nhie', 'never'],
  description: 'Play Never Have I Ever',
  category: 'fun',
  usage: 'neverhaveiever',
  examples: ['neverhaveiever'],
  cooldown: 5000,
  async execute({ reply }) {
    const statement = statements[Math.floor(Math.random() * statements.length)];
    await reply(`🙋 NEVER HAVE I EVER\n\n${statement}\n\n👍 = I have\n👎 = I haven\'t`);
  },
};
