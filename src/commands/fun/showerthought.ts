import type { Command, CommandContext } from '../../types/index.js';

const thoughts = [
  "If you clean a vacuum cleaner, you become the vacuum cleaner",
  "The word 'bed' actually looks like a bed",
  "Your future self is watching you through memories",
  "Every mirror you buy is used",
  "You've never seen your own face, only photos and reflections",
  "Nothing is on fire, fire is on things",
  "The word 'swims' upside down is still 'swims'",
  "You're not stuck in traffic, you ARE the traffic",
  "If two mind readers read each other's minds, whose mind are they reading?",
  "Every time you wake up, you respawn",
  "Somewhere in the world, you're someone's favorite person",
  "Your stomach thinks all potatoes are mashed",
  "The youngest photo of you is also the oldest",
  "Lasagna is just spaghetti flavored cake",
  "A different version of you exists in everyone's mind",
  "When you say 'forward' or 'back', your lips move in those directions",
  "You will never stand backwards on stairs",
  "The letter 'W' is the only letter said with more syllables than one",
  "Brain named itself",
  "There are more ways to shuffle a deck of cards than atoms on Earth",
];

const command: Command = {
  name: 'showerthought',
  aliases: ['st', 'thought', 'mindblow'],
  description: 'Get a random shower thought',
  category: 'fun',
  usage: 'showerthought',
  examples: ['showerthought'],
  cooldown: 3000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    const thought = thoughts[Math.floor(Math.random() * thoughts.length)];

    await reply(`╭─────────────────╮
│ 🚿 SHOWER THOUGHT
╰─────────────────╯

"${thought}"

🤯 Mind = Blown`);
  }
};

export default command;
