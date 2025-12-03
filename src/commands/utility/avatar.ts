import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'avatar',
  aliases: ['pfp', 'dp', 'profilepic'],
  description: 'Get the profile picture of a user',
  category: 'utility',
  usage: 'avatar [@mention or reply]',
  examples: ['avatar', 'avatar @username'],
  cooldown: 5,

  async execute({ api, event, args, reply }) {
    let targetId = String(event.senderID);
    
    if (event.messageReply) {
      targetId = String(event.messageReply.senderID);
    } else if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = String(Object.keys(event.mentions)[0]);
    } else if (args[0]) {
      targetId = String(args[0].replace(/[^0-9]/g, ''));
    }

    if (!targetId) {
      await reply('❌ Please mention someone or reply to their message.');
      return;
    }

    try {
      const userInfo = await new Promise<Record<string, any>>((resolve, reject) => {
        api.getUserInfo(targetId, (err: Error | null, info: any) => {
          if (err) reject(err);
          else resolve(info);
        });
      });

      const user = userInfo[targetId];
      if (!user) {
        await reply('❌ Could not find user information.');
        return;
      }

      const avatarUrl = `https://graph.facebook.com/${targetId}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      await reply(`📷 *Profile Picture*\n\n👤 Name: ${user.name}\n🔗 Link: ${avatarUrl}`);
    } catch (error) {
      await reply('❌ Failed to get profile picture.');
    }
  },
};
