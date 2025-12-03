import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'adminlist',
  aliases: ['admins', 'groupadmins', 'listadmins'],
  description: 'Show the list of group administrators',
  category: 'admin',
  usage: 'adminlist',
  examples: ['adminlist'],
  cooldown: 10,

  async execute({ api, event, reply }) {
    if (!event.isGroup) {
      await reply('❌ This command can only be used in group chats.');
      return;
    }

    try {
      const threadId = String(event.threadID);
      const threadInfo = await new Promise<any>((resolve, reject) => {
        api.getThreadInfo(threadId, (err: Error | null, info: any) => {
          if (err) reject(err);
          else resolve(info);
        });
      });

      const adminIDs = threadInfo.adminIDs || [];
      
      if (adminIDs.length === 0) {
        await reply('ℹ️ This group has no administrators.');
        return;
      }

      const adminIds = adminIDs.map((admin: any) => String(admin.id || admin));
      
      const userInfo = await new Promise<Record<string, any>>((resolve, reject) => {
        api.getUserInfo(adminIds, (err: Error | null, info: any) => {
          if (err) reject(err);
          else resolve(info);
        });
      });

      let message = `👑 *Group Administrators*\n\n`;
      message += `📊 Total: ${adminIds.length} admin(s)\n\n`;

      adminIds.forEach((id: string, index: number) => {
        const user = userInfo[id];
        const name = user?.name || 'Unknown';
        message += `${index + 1}. ${name}\n   🆔 ${id}\n`;
      });

      await reply(message);
    } catch (error) {
      await reply('❌ Failed to get admin list.');
    }
  },
};
