import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';
import { decorations } from '../../lib/messageFormatter.js';
import fmt from '../../lib/messageFormatter.js';

const command: Command = {
  name: 'profile',
  aliases: ['me', 'user', 'myprofile'],
  description: 'Display your profile or another user\'s profile',
  category: 'general',
  usage: 'profile [@mention|userID]',
  examples: ['profile', 'profile @user'],
  cooldown: 8000,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, args, reply } = context;
    
    let targetId = ('' + event.senderID).trim();
    
    if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = ('' + Object.keys(event.mentions)[0]).trim();
    } else if (args[0] && /^\d+$/.test(args[0])) {
      targetId = ('' + args[0]).trim();
    }
    
    try {
      const userInfo = await api.getUserInfo(targetId);
      
      const info = userInfo[targetId];
      if (!info) {
        await reply(`${decorations.fire} 『 ERROR 』
━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Could not find user info`);
        return;
      }
      
      const userData = await database.getOrCreateUser(targetId, info.name);
      
      const level = userData?.level || 0;
      const xp = userData?.xp || 0;
      const totalMessages = userData?.totalMessages || 0;
      const xpForNextLevel = (level + 1) * 100;
      const progressBar = fmt.createProgressBar(xp, xpForNextLevel, 12);
      
      const genderEmoji = info.gender === '2' ? '👨' : info.gender === '1' ? '👩' : '🧑';
      const genderText = info.gender === '2' ? 'Male' : info.gender === '1' ? 'Female' : 'Not specified';
      
      const rankEmoji = level >= 50 ? '👑' : level >= 30 ? '💎' : level >= 20 ? '🏆' : level >= 10 ? '⭐' : level >= 5 ? '🌟' : '✨';
      
      await reply(`${decorations.crown} 『 USER PROFILE 』 ${decorations.crown}
━━━━━━━━━━━━━━━━━━━━━━━━━

◈ IDENTITY
━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Name: ${info.name}
🆔 ID: ${targetId}
${genderEmoji} Gender: ${genderText}

◈ LEVEL STATS ${rankEmoji}
━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Level: ${level}
⭐ XP: ${xp}/${xpForNextLevel}
${progressBar}
💬 Messages: ${fmt.formatNumber(totalMessages)}

◈ PROFILE LINK
━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 ${info.profileUrl || `fb.com/${targetId}`}

━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.sparkle} Keep chatting to level up!`);
    } catch (error) {
      await reply(`${decorations.fire} 『 ERROR 』
━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Failed to fetch profile`);
    }
  }
};

export default command;
