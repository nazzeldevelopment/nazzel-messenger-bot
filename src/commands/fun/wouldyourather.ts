import type { Command, CommandContext } from '../../types/index.js';

const questions = [
  ["Be able to fly", "Be able to read minds"],
  ["Be rich and ugly", "Poor and good looking"],
  ["Live in the past", "Live in the future"],
  ["Be famous", "Be powerful"],
  ["Have no friends", "Have fake friends"],
  ["Be blind", "Be deaf"],
  ["Never use social media again", "Never watch TV again"],
  ["Have unlimited money", "Unlimited love"],
  ["Be able to teleport", "Be able to time travel"],
  ["Speak all languages", "Play all instruments"],
  ["Live without music", "Live without movies"],
  ["Be a famous singer", "Be a famous actor"],
  ["Have a pause button in life", "Have a rewind button in life"],
  ["Know how you die", "Know when you die"],
  ["Be incredibly intelligent", "Be incredibly attractive"],
  ["Have free WiFi everywhere", "Have free coffee everywhere"],
  ["Be able to talk to animals", "Speak all human languages"],
  ["Be always 10 minutes late", "Always 20 minutes early"],
  ["Have a personal chef", "Have a personal masseuse"],
  ["Be stranded on an island alone", "With someone you hate"],
  ["Never age physically", "Never age mentally"],
  ["Have super strength", "Have super speed"],
  ["Be famous when alive and forgotten after death", "Unknown when alive but famous after death"],
  ["Always be cold", "Always be hot"],
  ["Have a photographic memory", "Be able to forget anything at will"],
];

const command: Command = {
  name: 'wouldyourather',
  aliases: ['wyr', 'rather'],
  description: 'Get a Would You Rather question',
  category: 'fun',
  usage: 'wouldyourather',
  examples: ['wyr'],

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    
    const question = questions[Math.floor(Math.random() * questions.length)];
    
    await reply(`
╔══════════════════════════════════════╗
║      WOULD YOU RATHER?          ║
╠══════════════════════════════════════╣
║                                      ║
║  A) ${question[0]}
║                                      ║
║         OR                          ║
║                                      ║
║  B) ${question[1]}
║                                      ║
╠══════════════════════════════════════╣
║  Reply with A or B!                 ║
╚══════════════════════════════════════╝`);
  },
};

export default command;
