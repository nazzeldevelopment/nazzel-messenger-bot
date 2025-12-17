import type { Command, CommandContext } from '../../types/index.js';
import { safeGetUserInfo } from '../../lib/apiHelpers.js';

const compatibilityMessages: Record<string, string[]> = {
  high: [
    "You two are absolutely perfect for each other!",
    "A match made in heaven!",
    "The stars have aligned for this pairing!",
    "Destiny has brought you together!",
    "True soulmates, no doubt about it!",
  ],
  medium: [
    "You have potential! Work on communication.",
    "A solid match with room to grow.",
    "With effort, this could be great!",
    "You complement each other well.",
    "A promising connection!",
  ],
  low: [
    "Opposites attract... sometimes!",
    "This might need some work.",
    "Challenging, but not impossible!",
    "You'll need patience and understanding.",
    "An interesting dynamic for sure!",
  ],
};

const command: Command = {
  name: 'compatibility',
  aliases: ['compat', 'match', 'lovematch'],
  description: 'Check love compatibility between two people',
  category: 'fun',
  usage: 'compatibility @person1 @person2',
  examples: ['compatibility @John @Jane', 'compat @user1 @user2'],

  async execute(context: CommandContext): Promise<void> {
    const { reply, event, api } = context;
    
    const mentions = event.mentions ? Object.keys(event.mentions) : [];
    
    if (mentions.length < 2) {
      await reply('Please mention two people to check their compatibility!\nUsage: compatibility @person1 @person2');
      return;
    }
    
    const person1Id = mentions[0];
    const person2Id = mentions[1];
    
    let person1Name = 'Person 1';
    let person2Name = 'Person 2';
    
    try {
      const userInfo = await safeGetUserInfo(api, [person1Id, person2Id]);
      person1Name = userInfo[person1Id]?.name?.split(' ')[0] || 'Person 1';
      person2Name = userInfo[person2Id]?.name?.split(' ')[0] || 'Person 2';
    } catch (e) {}
    
    const seed = parseInt((person1Id + person2Id).slice(-8), 10);
    const percentage = (seed % 60) + 40;
    
    let category: 'high' | 'medium' | 'low';
    if (percentage >= 80) category = 'high';
    else if (percentage >= 60) category = 'medium';
    else category = 'low';
    
    const messages = compatibilityMessages[category];
    const message = messages[seed % messages.length];
    
    const hearts = percentage >= 80 ? '' : percentage >= 60 ? '' : '';
    const progressBar = ''.repeat(Math.floor(percentage / 10)) + ''.repeat(10 - Math.floor(percentage / 10));
    
    await reply(`
╔══════════════════════════════════════╗
║      LOVE COMPATIBILITY         ║
╠══════════════════════════════════════╣
║                                      ║
║  ${person1Name}  ${hearts}  ${person2Name}
║                                      ║
╠══════════════════════════════════════╣
║  COMPATIBILITY SCORE            ║
╠══════════════════════════════════════╣
║                                      ║
║  ${progressBar}  ${percentage}%
║                                      ║
╠══════════════════════════════════════╣
║  ANALYSIS                       ║
╠══════════════════════════════════════╣
║                                      ║
║  ${message}
║                                      ║
╚══════════════════════════════════════╝`);
  },
};

export default command;
