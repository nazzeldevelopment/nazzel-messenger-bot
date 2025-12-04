import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';
import { decorations } from '../../lib/messageFormatter.js';
import fmt from '../../lib/messageFormatter.js';

export const command: Command = {
  name: 'rank',
  aliases: ['position', 'standing', 'myrank'],
  description: 'See your rank on the leaderboard',
  category: 'level',
  usage: 'rank [@mention]',
  examples: ['rank', 'rank @user'],
  cooldown: 5000,

  async execute({ api, event, args, reply }) {
    let targetId = ('' + event.senderID).trim();
    
    if (event.messageReply) {
      targetId = ('' + event.messageReply.senderID).trim();
    } else if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = ('' + Object.keys(event.mentions)[0]).trim();
    } else if (args[0]) {
      const parsed = args[0].replace(/[^0-9]/g, '');
      targetId = parsed ? ('' + parsed).trim() : ('' + event.senderID).trim();
    }

    try {
      const userInfo = await api.getUserInfo(targetId);
      const userName = userInfo[targetId]?.name || 'Unknown User';
      
      const user = await database.getOrCreateUser(targetId, userName);
      
      if (!user) {
        await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Could not fetch user data`);
        return;
      }

      const leaderboard = await database.getLeaderboard(100);
      const userIndex = leaderboard.findIndex(u => u.id === targetId);
      const rank = userIndex >= 0 ? userIndex + 1 : leaderboard.length + 1;
      const xpForNextLevel = (user.level + 1) * 100;
      const progressBar = fmt.createProgressBar(user.xp, xpForNextLevel, 12);

      let rankEmoji = '📊';
      let rankTitle = 'Member';
      if (rank === 1) { rankEmoji = '🥇'; rankTitle = 'Champion'; }
      else if (rank === 2) { rankEmoji = '🥈'; rankTitle = 'Runner-up'; }
      else if (rank === 3) { rankEmoji = '🥉'; rankTitle = 'Bronze'; }
      else if (rank <= 10) { rankEmoji = '🏅'; rankTitle = 'Top 10'; }
      else if (rank <= 25) { rankEmoji = '⭐'; rankTitle = 'Rising Star'; }

      await reply(`${rankEmoji} 『 RANK INFO 』 ${rankEmoji}
═══════════════════════════
👤 ${userName}
🏷️ ${rankTitle}
═══════════════════════════

◈ LEVEL PROGRESS
═══════════════════════════
🏆 Level: ${user.level}
⭐ XP: ${user.xp}/${xpForNextLevel}
${progressBar}

◈ STANDING
═══════════════════════════
${rankEmoji} Rank: #${rank}
💬 Messages: ${fmt.formatNumber(user.totalMessages)}

═══════════════════════════
${decorations.sparkle} Climb the ranks!`);
    } catch (error) {
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Failed to get rank info`);
    }
  },
};
