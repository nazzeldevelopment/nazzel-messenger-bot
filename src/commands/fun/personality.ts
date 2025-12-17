import type { Command, CommandContext } from '../../types/index.js';
import { safeGetUserInfo } from '../../lib/apiHelpers.js';

const traits = [
  "Creative", "Logical", "Empathetic", "Adventurous", "Analytical",
  "Artistic", "Confident", "Curious", "Determined", "Energetic",
  "Friendly", "Generous", "Honest", "Imaginative", "Independent",
  "Kind", "Loyal", "Optimistic", "Patient", "Responsible",
  "Sensitive", "Thoughtful", "Witty", "Ambitious", "Charming",
];

const quirks = [
  "secretly loves pineapple on pizza",
  "talks to plants",
  "dances in the shower",
  "sings to their pets",
  "has an unusual collection",
  "gives the best hugs",
  "can never find matching socks",
  "is addicted to coffee",
  "stays up too late watching videos",
  "always takes the best photos",
  "has the best meme game",
  "gives the best advice",
  "is always the last one ready",
  "has the best snack drawer",
  "makes the best playlists",
];

const animals = [
  "Majestic Eagle", "Playful Dolphin", "Wise Owl", "Loyal Wolf", "Curious Cat",
  "Gentle Panda", "Fierce Lion", "Free Spirit Butterfly", "Clever Fox", "Strong Bear",
  "Peaceful Dove", "Mysterious Raven", "Graceful Swan", "Friendly Dog", "Noble Horse",
];

const command: Command = {
  name: 'personality',
  aliases: ['pers', 'whatami', 'trait'],
  description: 'Get a fun personality analysis',
  category: 'fun',
  usage: 'personality [@user]',
  examples: ['personality', 'personality @someone'],

  async execute(context: CommandContext): Promise<void> {
    const { reply, event, api } = context;
    
    let userId = event.senderID;
    let userName = 'You';
    
    if (event.mentions && Object.keys(event.mentions).length > 0) {
      userId = Object.keys(event.mentions)[0];
    }
    
    try {
      const userInfo = await safeGetUserInfo(api, userId);
      userName = userInfo[userId]?.name?.split(' ')[0] || 'You';
    } catch (e) {}
    
    const seed = parseInt(userId.slice(-6), 10) || Math.random() * 1000000;
    const randomIndex = (arr: any[], offset: number = 0) => 
      arr[Math.floor((seed + offset) % arr.length)];
    
    const trait1 = randomIndex(traits, 0);
    const trait2 = randomIndex(traits, 7);
    const trait3 = randomIndex(traits, 13);
    const quirk = randomIndex(quirks, 3);
    const animal = randomIndex(animals, 5);
    
    const positivePercent = (seed % 30) + 70;
    const creativity = (seed % 40) + 60;
    const kindness = ((seed * 7) % 30) + 70;
    
    await reply(`
╔══════════════════════════════════════╗
║     PERSONALITY ANALYSIS        ║
╠══════════════════════════════════════╣
║                                      ║
║  Analysis for: ${userName}
║                                      ║
╠══════════════════════════════════════╣
║  CORE TRAITS                    ║
╠══════════════════════════════════════╣
║  1. ${trait1}
║  2. ${trait2}
║  3. ${trait3}
║                                      ║
╠══════════════════════════════════════╣
║  SPIRIT ANIMAL                  ║
╠══════════════════════════════════════╣
║  ${animal}
║                                      ║
╠══════════════════════════════════════╣
║  FUN FACT                       ║
╠══════════════════════════════════════╣
║  ${userName} ${quirk}!
║                                      ║
╠══════════════════════════════════════╣
║  STATS                          ║
╠══════════════════════════════════════╣
║  Positivity: ${positivePercent}%
║  Creativity: ${creativity}%
║  Kindness: ${kindness}%
║                                      ║
╚══════════════════════════════════════╝`);
  },
};

export default command;
