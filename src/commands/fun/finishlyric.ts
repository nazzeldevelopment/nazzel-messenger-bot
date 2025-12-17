import type { Command, CommandContext } from '../../types/index.js';

const lyrics = [
  { start: "Is this the real life?", answer: "Is this just fantasy?" },
  { start: "Hello, it's me", answer: "I was wondering if after all these years you'd like to meet" },
  { start: "Just a small town girl", answer: "Living in a lonely world" },
  { start: "We're no strangers to love", answer: "You know the rules and so do I" },
  { start: "I got my mind on my money", answer: "And my money on my mind" },
  { start: "Hey, I just met you", answer: "And this is crazy" },
  { start: "See you again", answer: "When I see you again" },
  { start: "Someone like you", answer: "I wish nothing but the best for you" },
  { start: "Baby, baby, baby", answer: "Oh" },
  { start: "I came in like a", answer: "Wrecking ball" },
  { start: "Oppa Gangnam", answer: "Style" },
  { start: "We will, we will", answer: "Rock you" },
  { start: "Sweet Caroline", answer: "Bah bah bah" },
  { start: "I want it that", answer: "Way" },
  { start: "Cause baby you're a", answer: "Firework" },
];

const command: Command = {
  name: 'finishlyric',
  aliases: ['lyricgame', 'singalong', 'finishthesong'],
  description: 'Finish the song lyrics game',
  category: 'fun',
  usage: 'finishlyric',
  examples: ['finishlyric'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    const lyric = lyrics[Math.floor(Math.random() * lyrics.length)];

    await reply(`╭─────────────────╮
│ 🎵 FINISH THE LYRIC
╰─────────────────╯

"${lyric.start}..."

What comes next? 🎤

(Answer: ${lyric.answer})`);
  }
};

export default command;
