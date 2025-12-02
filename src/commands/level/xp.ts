import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';

const command: Command = {
  name: 'xp',
  aliases: ['exp', 'experience'],
  description: 'Show your current XP',
  category: 'level',
  usage: 'xp',
  examples: ['xp'],

  async execute(context: CommandContext): Promise<void> {
    const { event, reply } = context;
    
    try {
      const userData = await database.getOrCreateUser(event.senderID);
      
      if (!userData) {
        await reply('❌ Could not fetch XP data.');
        return;
      }
      
      const xp = userData.xp;
      const level = userData.level;
      const xpForNextLevel = (level + 1) * 100;
      const xpNeeded = xpForNextLevel - xp;
      
      await reply(`✨ XP: ${xp}/${xpForNextLevel}\n📈 Need ${xpNeeded} more XP to level up!`);
    } catch (error) {
      await reply('❌ Failed to fetch XP data.');
    }
  }
};

export default command;
