import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'gayrate',
  aliases: ['howgay', 'gaytest'],
  description: 'Check how gay someone is (just for fun!)',
  category: 'fun',
  usage: 'gayrate [@mention]',
  examples: ['gayrate', 'gayrate @user'],
  cooldown: 5,

  async execute({ api, event, args, reply }) {
    let targetId = String(event.senderID);
    
    if (event.messageReply) {
      targetId = String(event.messageReply.senderID);
    } else if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = String(Object.keys(event.mentions)[0]);
    }

    try {
      const userInfo = await new Promise<Record<string, any>>((resolve, reject) => {
        api.getUserInfo(targetId, (err: Error | null, info: any) => {
          if (err) reject(err);
          else resolve(info);
        });
      });

      const userName = userInfo[targetId]?.name || 'User';
      
      const today = new Date().toDateString();
      const seed = (targetId + today).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
      const percentage = seed % 101;

      let bar = '';
      const filled = Math.round(percentage / 10);
      for (let i = 0; i < 10; i++) {
        bar += i < filled ? '🏳️‍🌈' : '⬜';
      }

      let comment = '';
      if (percentage >= 90) {
        comment = 'Certified rainbow! 🌈✨';
      } else if (percentage >= 70) {
        comment = 'Pretty colorful! 🎨';
      } else if (percentage >= 50) {
        comment = 'Perfectly balanced! ⚖️';
      } else if (percentage >= 30) {
        comment = 'Mostly straight! 📏';
      } else {
        comment = 'Super straight! ➡️';
      }

      let message = `🏳️‍🌈 *Gay Rate*\n\n`;
      message += `👤 ${userName}\n\n`;
      message += `${bar}\n`;
      message += `📊 ${percentage}% gay\n\n`;
      message += `💬 ${comment}\n\n`;
      message += `(This is just for fun! 😄)`;

      await reply(message);
    } catch (error) {
      await reply('❌ Failed to calculate gayrate.');
    }
  },
};
