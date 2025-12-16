import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { decorations } from '../../lib/messageFormatter.js';
import { safeGetThreadInfo, safeGetUserInfo } from '../../lib/apiHelpers.js';

const command: Command = {
  name: 'getadmins',
  aliases: ['admins', 'gcadmins', 'listadmins'],
  description: 'Get list of all group admins',
  category: 'admin',
  usage: 'getadmins',
  examples: ['getadmins'],
  adminOnly: false,
  cooldown: 8000,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, reply } = context;
    
    try {
      const threadInfo = await safeGetThreadInfo(api, event.threadID);
      
      if (!threadInfo) {
        await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Unable to fetch group info. Please try again later.`);
        return;
      }
      
      if (!threadInfo.isGroup) {
        await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ This command only works in groups`);
        return;
      }
      
      const adminIDs = (threadInfo.adminIDs || []).map((a: any) => a.id || a);
      
      if (adminIDs.length === 0) {
        await reply(`${decorations.fire} 『 NO ADMINS 』
═══════════════════════════
ℹ️ This group has no admins`);
        return;
      }
      
      const userInfos = await safeGetUserInfo(api, adminIDs);
      
      let adminList = '';
      let index = 1;
      
      for (const adminId of adminIDs) {
        const info = userInfos[adminId];
        const name = info?.name || 'Unknown';
        const isCreator = adminId === threadInfo.threadID;
        adminList += `${index}. ${name}${isCreator ? ' 👑' : ''}\n   └─ ID: ${adminId}\n`;
        index++;
      }
      
      const groupName = threadInfo.threadName || 'This Group';
      
      await reply(`👥 『 GROUP ADMINS 』 👥
═══════════════════════════
${decorations.fire} ${groupName}
═══════════════════════════

◈ ADMIN LIST (${adminIDs.length})
═══════════════════════════
${adminList}
═══════════════════════════
${decorations.sparkle} 👑 = Group Creator`);
      
      BotLogger.info(`Listed ${adminIDs.length} admins for group ${event.threadID}`);
    } catch (err) {
      BotLogger.error(`Failed to get admins for group ${event.threadID}`, err);
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Failed to get admin list`);
    }
  }
};

export default command;
