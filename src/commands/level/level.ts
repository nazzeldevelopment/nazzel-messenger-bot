import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';

const command: Command = {
  name: 'level',
  aliases: ['lvl', 'rank'],
  description: 'Show your current level and XP',
  category: 'level',
  usage: 'level [@mention|userID]',
  examples: ['level', 'level @user'],

  async execute(context: CommandContext): Promise<void> {
    const { api, event, args, reply } = context;
    
    let targetId = ('' + event.senderID).trim();
    
    if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = ('' + Object.keys(event.mentions)[0]).trim();
    } else if (args[0] && /^\d+$/.test(args[0])) {
      targetId = ('' + args[0]).trim();
    }
    
    try {
      const userInfo = await new Promise<Record<string, { name: string }>>((resolve, reject) => {
        api.getUserInfo(targetId, (err: Error | null, info: Record<string, { name: string }>) => {
          if (err) reject(err);
          else resolve(info);
        });
      });
      
      const userName = userInfo[targetId]?.name || 'Unknown';
      const userData = await database.getOrCreateUser(targetId, userName);
      
      if (!userData) {
        await reply('❌ Could not fetch user data.');
        return;
      }
      
      const level = userData.level;
      const xp = userData.xp;
      const xpForNextLevel = (level + 1) * 100;
      const progressBar = createProgressBar(xp, xpForNextLevel, 15);
      const rank = await getUserRank(targetId);
      
      const response = `╔═══════════════════════════════╗
║ ⭐ LEVEL STATS
╠═══════════════════════════════╣
║ 👤 ${userName}
╠═══════════════════════════════╣
║ 🏆 Level: ${level}
║ ✨ XP: ${xp}/${xpForNextLevel}
║ 📊 ${progressBar}
║ 🎖️ Rank: #${rank}
║ 💬 Messages: ${userData.totalMessages}
╚═══════════════════════════════╝`;
      
      await reply(response);
    } catch (error) {
      await reply('❌ Failed to fetch level data.');
    }
  }
};

function createProgressBar(current: number, max: number, length: number = 15): string {
  const percentage = Math.min(current / max, 1);
  const filled = Math.round(percentage * length);
  const empty = length - filled;
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${Math.round(percentage * 100)}%`;
}

async function getUserRank(userId: string): Promise<number> {
  const leaderboard = await database.getLeaderboard(100);
  const index = leaderboard.findIndex(u => u.id === userId);
  return index >= 0 ? index + 1 : leaderboard.length + 1;
}

export default command;
