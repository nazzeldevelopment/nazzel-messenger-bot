import type { Command, CommandContext } from '../../types/index.js';

const challenges = [
  "Don't use your phone for 1 hour",
  "Compliment 3 different people today",
  "Do 10 push-ups right now",
  "Drink 8 glasses of water today",
  "Send a message to someone you haven't talked to in a while",
  "Learn one new word in another language",
  "Clean your room for 15 minutes",
  "Take a 5-minute walk outside",
  "Write down 3 things you're grateful for",
  "Read for 20 minutes",
  "Do a random act of kindness",
  "Try a new food today",
  "Wake up early tomorrow",
  "Take a photo of something beautiful",
  "Learn a new skill for 30 minutes",
  "Stretch for 10 minutes",
  "Write a short poem",
  "Cook a meal from scratch",
  "Meditate for 5 minutes",
  "Go to bed on time tonight",
];

const command: Command = {
  name: 'challenge',
  aliases: ['dailychallenge', 'task', 'mission'],
  description: 'Get a random challenge to do',
  category: 'fun',
  usage: 'challenge',
  examples: ['challenge'],
  cooldown: 30000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];

    await reply(`╭─────────────────╮
│ 🎯 CHALLENGE
╰─────────────────╯

Your challenge:
"${challenge}"

Can you complete it? 💪`);
  }
};

export default command;
