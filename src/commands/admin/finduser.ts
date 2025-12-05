import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { database } from '../../database/index.js';
import { decorations } from '../../lib/messageFormatter.js';

const command: Command = {
  name: 'finduser',
  aliases: ['searchuser', 'lookupuser'],
  description: 'Find a user in the database by their ID',
  category: 'admin',
  usage: 'finduser <userID>',
  examples: ['finduser 123456789'],
  ownerOnly: true,
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { api, args, reply, prefix } = context;
    
    if (!args[0]) {
      await reply(`🔍 『 FIND USER 』 🔍
═══════════════════════════
${decorations.fire} Search User Database
═══════════════════════════

◈ USAGE
═══════════════════════════
➤ ${prefix}finduser <userID>

◈ EXAMPLE
═══════════════════════════
➤ ${prefix}finduser 123456789`);
      return;
    }
    
    const userId = args[0].replace(/[^0-9]/g, '');
    
    try {
      const user = await database.getUser(userId);
      
      if (!user) {
        await reply(`${decorations.fire} 『 NOT FOUND 』
═══════════════════════════
❌ User not found in database
🆔 ID: ${userId}`);
        return;
      }
      
      let fbName = 'Unknown';
      try {
        const userInfo = await api.getUserInfo(userId);
        fbName = userInfo[userId]?.name || 'Unknown';
      } catch (e) {}
      
      const joinDate = user.joinedAt ? new Date(user.joinedAt).toLocaleDateString('en-US', {
        timeZone: 'Asia/Manila',
        dateStyle: 'medium'
      }) : 'Unknown';
      
      await reply(`🔍 『 USER FOUND 』 🔍
═══════════════════════════
${decorations.fire} User Information
═══════════════════════════

◈ PROFILE
═══════════════════════════
👤 Name: ${user.name || fbName}
🆔 ID: ${userId}
📅 Joined: ${joinDate}

◈ STATS
═══════════════════════════
⭐ Level: ${user.level || 0}
✨ XP: ${user.xp || 0}
💰 Coins: ${(user.coins || 0).toLocaleString()}
💬 Messages: ${(user.totalMessages || 0).toLocaleString()}
🔥 Daily Streak: ${user.dailyStreak || 0}

═══════════════════════════
${decorations.sparkle} Database Record Found`);
      
      BotLogger.info(`Found user ${userId} in database`);
    } catch (err) {
      BotLogger.error(`Failed to find user ${userId}`, err);
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Failed to search database`);
    }
  }
};

export default command;
