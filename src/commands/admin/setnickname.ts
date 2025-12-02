import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'setnickname',
  aliases: ['nick', 'nickname', 'setpalayaw'],
  description: 'Change a user\'s nickname in the group',
  category: 'admin',
  usage: 'setnickname <@mention> <new nickname>',
  examples: ['setnickname @user Cool Guy', 'setnickname @friend Boss'],
  cooldown: 10,
  adminOnly: true,

  async execute({ api, event, args, reply }) {
    if (!event.isGroup) {
      await reply('❌ This command can only be used in group chats.');
      return;
    }

    let targetId = '';
    let nickname = '';

    if (event.messageReply) {
      targetId = event.messageReply.senderID;
      nickname = args.join(' ');
    } else if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = Object.keys(event.mentions)[0];
      const mentionName = event.mentions[targetId];
      nickname = args.join(' ').replace(`@${mentionName}`, '').trim();
    } else {
      await reply('❌ Please mention a user or reply to their message.\n\nUsage: setnickname @user <new nickname>');
      return;
    }

    if (!nickname) {
      await reply('❌ Please provide a nickname.\n\nUsage: setnickname @user <new nickname>');
      return;
    }

    if (nickname.length > 50) {
      await reply('❌ Nickname is too long! Maximum 50 characters.');
      return;
    }

    try {
      const userInfo = await new Promise<Record<string, any>>((resolve, reject) => {
        api.getUserInfo(targetId, (err: Error | null, info: any) => {
          if (err) reject(err);
          else resolve(info);
        });
      });

      const userName = userInfo[targetId]?.name || 'Unknown User';

      await new Promise<void>((resolve, reject) => {
        api.changeNickname(nickname, event.threadID, targetId, (err: Error | null) => {
          if (err) reject(err);
          else resolve();
        });
      });

      await reply(`✅ *Nickname Changed*\n\n👤 User: ${userName}\n📝 New nickname: ${nickname}`);
    } catch (error) {
      await reply('❌ Failed to change nickname. Make sure the bot has permission.');
    }
  },
};
