import type { Command } from '../../types/index.js';
import { decorations } from '../../lib/messageFormatter.js';

const compliments = [
  "You're an amazing person, inside and out!",
  "Your smile is contagious!",
  "You have the best ideas!",
  "You're more helpful than you realize.",
  "You're one of the strongest people I know!",
  "You light up the room!",
  "You're making a difference just by being you.",
  "You're braver than you believe and stronger than you seem.",
  "The world is better because you're in it.",
  "You're not just smart, you're wise.",
  "Your kindness is a balm to all who encounter it.",
  "You're more fun than bubble wrap!",
  "You have impeccable taste.",
  "You're like a ray of sunshine on a cloudy day.",
  "You make people feel valued and heard.",
  "Your creativity is absolutely inspiring!",
  "You have a heart of gold!",
  "Everyone is lucky to know you.",
  "You deserve all the good things coming your way!",
  "You're crushing it! Keep being awesome!",
  "Ang galing mo talaga! Keep it up!",
  "Napakabait mong tao!",
  "Ang sipag mo, nakaka-inspire ka!",
  "You're one in a million!",
  "Ang saya mo kasama!",
  "Your energy is absolutely contagious!",
  "You make everything better!",
  "The way you carry yourself is inspiring!",
];

const complimentEmojis = ['💖', '✨', '🌟', '💫', '🌈', '💝'];

export const command: Command = {
  name: 'compliment',
  aliases: ['praise', 'boost', 'puri', 'cheer'],
  description: 'Get a random compliment to brighten your day',
  category: 'fun',
  usage: 'compliment',
  examples: ['compliment'],
  cooldown: 5000,

  async execute({ reply }) {
    const compliment = compliments[Math.floor(Math.random() * compliments.length)];
    const emoji = complimentEmojis[Math.floor(Math.random() * complimentEmojis.length)];
    
    await reply(`${emoji} 『 COMPLIMENT 』 ${emoji}
═══════════════════════════
${decorations.sparkle} Here's something for you!
═══════════════════════════

${compliment}

═══════════════════════════
${decorations.heart} You're amazing! Never forget that!`);
  },
};
