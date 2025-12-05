import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { database } from '../../database/index.js';
import { decorations } from '../../lib/messageFormatter.js';

const command: Command = {
  name: 'userdata',
  aliases: ['getdata', 'viewdata'],
  description: 'View detailed user data from database',
  category: 'admin',
  usage: 'userdata <@mention|userID>',
  examples: ['userdata @user', 'userdata 123456789'],
  ownerOnly: true,
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, args, reply, prefix } = context;
    
    let targetId: string | null = null;
    
    if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = String(Object.keys(event.mentions)[0]);
    } else if (args[0]) {
      targetId = args[0].replace(/[^0-9]/g, '');
    }
    
    if (!targetId) {
      await reply(`📋 『 USER DATA 』 📋
═══════════════════════════
${decorations.fire} View User Database Record
═══════════════════════════

◈ USAGE
═══════════════════════════
➤ ${prefix}userdata @user
➤ ${prefix}userdata <userID>

◈ EXAMPLE
═══════════════════════════
➤ ${prefix}userdata 123456789`);
      return;
    }
    
    try {
      const user = await database.getUser(targetId);
      
      if (!user) {
        await reply(`${decorations.fire} 『 NO DATA 』
═══════════════════════════
❌ No data found for this user
🆔 ID: ${targetId}`);
        return;
      }
      
      let fbName = 'Unknown';
      try {
        const userInfo = await api.getUserInfo(targetId);
        fbName = userInfo[targetId]?.name || 'Unknown';
      } catch (e) {}
      
      const joinDate = user.joinedAt ? new Date(user.joinedAt).toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        dateStyle: 'medium',
        timeStyle: 'short'
      }) : 'Unknown';
      
      const updateDate = user.updatedAt ? new Date(user.updatedAt).toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        dateStyle: 'medium',
        timeStyle: 'short'
      }) : 'Unknown';
      
      const lastXP = user.lastXpGain ? new Date(user.lastXpGain).toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        dateStyle: 'short',
        timeStyle: 'short'
      }) : 'Never';
      
      const lastClaim = user.lastDailyClaim ? new Date(user.lastDailyClaim).toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        dateStyle: 'short',
        timeStyle: 'short'
      }) : 'Never';
      
      await reply(`📋 『 USER DATA 』 📋
═══════════════════════════
${decorations.fire} Complete Database Record
═══════════════════════════

◈ IDENTITY
═══════════════════════════
👤 DB Name: ${user.name || 'Not Set'}
👤 FB Name: ${fbName}
🆔 User ID: ${targetId}

◈ PROGRESSION
═══════════════════════════
⭐ Level: ${user.level || 0}
✨ XP: ${user.xp || 0}
💬 Messages: ${(user.totalMessages || 0).toLocaleString()}

◈ ECONOMY
═══════════════════════════
💰 Coins: ${(user.coins || 0).toLocaleString()}
🔥 Streak: ${user.dailyStreak || 0} days
📅 Last Claim: ${lastClaim}

◈ TIMESTAMPS
═══════════════════════════
📅 Joined: ${joinDate}
🔄 Updated: ${updateDate}
✨ Last XP: ${lastXP}

═══════════════════════════
${decorations.sparkle} Raw Database Record`);
      
      BotLogger.info(`Retrieved user data for ${targetId}`);
    } catch (err) {
      BotLogger.error(`Failed to get user data for ${targetId}`, err);
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Failed to retrieve user data`);
    }
  }
};

export default command;
