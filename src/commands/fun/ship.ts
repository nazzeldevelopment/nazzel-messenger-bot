import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'ship',
  aliases: ['love', 'match', 'compatibility'],
  description: 'Check love compatibility between two users',
  category: 'fun',
  usage: 'ship <@user1> <@user2>',
  examples: ['ship @user1 @user2', 'ship me @someone'],
  cooldown: 5,

  async execute({ api, event, args, reply }) {
    const mentions = Object.keys(event.mentions || {});
    let user1Id = String(event.senderID);
    let user2Id = '';

    if (mentions.length >= 2) {
      user1Id = String(mentions[0]);
      user2Id = String(mentions[1]);
    } else if (mentions.length === 1) {
      user2Id = String(mentions[0]);
    } else if (event.messageReply) {
      user2Id = String(event.messageReply.senderID);
    } else {
      await reply('❌ Please mention two users or reply to someone\'s message.\n\nUsage: ship @user1 @user2');
      return;
    }

    if (user1Id === user2Id) {
      await reply('💕 Self-love is important! 100% compatibility with yourself!');
      return;
    }

    try {
      const userInfo = await new Promise<Record<string, any>>((resolve, reject) => {
        api.getUserInfo([user1Id, user2Id], (err: Error | null, info: any) => {
          if (err) reject(err);
          else resolve(info);
        });
      });

      const name1 = userInfo[user1Id]?.name || 'User 1';
      const name2 = userInfo[user2Id]?.name || 'User 2';

      const seed = (user1Id + user2Id).split('').sort().join('');
      const hash = seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
      const percentage = (hash % 101);

      let hearts = '';
      const filledHearts = Math.round(percentage / 10);
      for (let i = 0; i < 10; i++) {
        hearts += i < filledHearts ? '❤️' : '🖤';
      }

      let message = `💕 *Love Calculator*\n\n`;
      message += `👤 ${name1}\n`;
      message += `💗 x 💗\n`;
      message += `👤 ${name2}\n\n`;
      message += `${hearts}\n`;
      message += `💘 Compatibility: ${percentage}%\n\n`;

      if (percentage >= 90) {
        message += `✨ Perfect match! Soulmates! 💑`;
      } else if (percentage >= 70) {
        message += `💖 Great compatibility! Love is in the air!`;
      } else if (percentage >= 50) {
        message += `💛 Good potential! Worth a shot!`;
      } else if (percentage >= 30) {
        message += `🤔 Could work with effort!`;
      } else {
        message += `💔 Hmm... better as friends maybe?`;
      }

      const shipName = name1.slice(0, Math.ceil(name1.length / 2)) + 
                       name2.slice(Math.floor(name2.length / 2));
      message += `\n\n🚢 Ship Name: ${shipName}`;

      await reply(message);
    } catch (error) {
      await reply('❌ Failed to calculate compatibility.');
    }
  },
};
