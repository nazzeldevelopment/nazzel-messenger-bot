import type { Command } from '../../types/index.js';
import { decorations } from '../../lib/messageFormatter.js';

export const command: Command = {
  name: 'gayrate',
  aliases: ['howgay', 'gaytest', 'rainbow'],
  description: 'Check the rainbow meter (just for fun!)',
  category: 'fun',
  usage: 'gayrate [@mention]',
  examples: ['gayrate', 'gayrate @user'],
  cooldown: 5000,

  async execute({ api, event, args, reply }) {
    let targetId = String(event.senderID);
    
    if (event.messageReply) {
      targetId = String(event.messageReply.senderID);
    } else if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = String(Object.keys(event.mentions)[0]);
    }

    try {
      const userInfo = await api.getUserInfo(targetId);
      const userName = userInfo[targetId]?.name || 'User';
      
      const today = new Date().toDateString();
      const seed = (targetId + today).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
      const percentage = seed % 101;

      const filled = Math.round(percentage / 10);
      const bar = '🏳️‍🌈'.repeat(filled) + '⬜'.repeat(10 - filled);

      let comment = '';
      let emoji = '';
      if (percentage >= 90) {
        emoji = '🌈';
        comment = 'Certified rainbow!';
      } else if (percentage >= 70) {
        emoji = '🎨';
        comment = 'Pretty colorful!';
      } else if (percentage >= 50) {
        emoji = '⚖️';
        comment = 'Perfectly balanced!';
      } else if (percentage >= 30) {
        emoji = '📏';
        comment = 'Mostly straight!';
      } else {
        emoji = '➡️';
        comment = 'Super straight!';
      }

      await reply(`🏳️‍🌈 『 RAINBOW METER 』 🏳️‍🌈
═══════════════════════════
👤 ${userName}
═══════════════════════════

${bar}

═══════════════════════════
📊 Result: ${percentage}%
${emoji} ${comment}
═══════════════════════════

${decorations.sparkle} Just for fun! Love is love!`);
    } catch (error) {
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Failed to calculate`);
    }
  },
};
