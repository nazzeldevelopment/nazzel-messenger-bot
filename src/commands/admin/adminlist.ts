import type { Command } from '../../types/index.js';
import { safeGetThreadInfo, safeGetUserInfo } from '../../lib/apiHelpers.js';

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
      
      let threadInfo;
      try {
        threadInfo = await safeGetThreadInfo(api, threadId);
      } catch (apiError: any) {
        const errorMsg = apiError?.message || String(apiError);
        if (errorMsg.includes('Not Found') || errorMsg.includes('not valid JSON')) {
          await reply('❌ Unable to fetch group info. The group may not be accessible or the API is temporarily unavailable.');
          return;
        }
        throw apiError;
      }

      if (!threadInfo) {
        await reply('❌ Could not retrieve group information.');
        return;
      }

      const adminIDs = threadInfo.adminIDs || [];
      
      if (adminIDs.length === 0) {
        await reply('ℹ️ This group has no administrators.');
        return;
      }

      const adminIds = adminIDs.map((admin: any) => ('' + (admin.id || admin)).trim());
      
      let userInfo: any = {};
      try {
        userInfo = await safeGetUserInfo(api, adminIds);
      } catch {
        // Continue even if user info fails
      }

      let message = `👑 *Group Administrators*\n\n`;
      message += `📊 Total: ${adminIds.length} admin(s)\n\n`;

      adminIds.forEach((id: string, index: number) => {
        const user = userInfo[id];
        const name = user?.name || 'Unknown';
        message += `${index + 1}. ${name}\n   🆔 ${id}\n`;
      });

      await reply(message);
    } catch (error: any) {
      console.error('Adminlist error:', error);
      await reply('❌ Failed to get admin list. Please try again later.');
    }
  },
};
