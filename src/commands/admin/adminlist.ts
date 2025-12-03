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
      const threadId = ('' + event.threadID).trim();
      const threadInfo = await api.getThreadInfo(threadId);

      const adminIDs = threadInfo.adminIDs || [];
      
      if (adminIDs.length === 0) {
        await reply('ℹ️ This group has no administrators.');
        return;
      }

      const adminIds = adminIDs.map((admin: any) => ('' + (admin.id || admin)).trim());
      const userInfo = await api.getUserInfo(adminIds);

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
