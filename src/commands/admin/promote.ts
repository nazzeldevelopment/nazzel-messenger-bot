import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { safeGetThreadInfo, safeGetUserInfo } from '../../lib/apiHelpers.js';

const command: Command = {
  name: 'promote',
  aliases: ['makeadmin', 'addadmin'],
  description: 'Promote a user to group admin',
  category: 'admin',
  usage: 'promote <@mention|userID>',
  examples: ['promote @user', 'promote 123456789'],
  adminOnly: true,
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, args, reply, prefix } = context;
    const threadId = String(event.threadID);
    const botId = String(api.getCurrentUserID());

    let targetId: string | null = null;

    if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = String(Object.keys(event.mentions)[0]).trim();
    } else if (args[0] && /^\d+$/.test(args[0])) {
      targetId = String(args[0]).trim();
    }

    if (!targetId) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  👑 PROMOTE USER
┗━━━━━━━━━━━━━━━━━━━━━┛

Make a user group admin.

📝 Usage: ${prefix}promote @user
📝 Usage: ${prefix}promote <userID>`);
      return;
    }

    try {
      const threadInfo = await safeGetThreadInfo(api, threadId);
      
      if (!threadInfo) {
        await reply(`┏━━━━━━━━━━━━━━━━━━━┓
┃  ❌ ERROR
┗━━━━━━━━━━━━━━━━━━━┛
Could not fetch group info. Please try again.`);
        return;
      }
      
      const adminIDs = (threadInfo.adminIDs || []).map((a: any) => String(a.id || a));
      const participantIDs = (threadInfo.participantIDs || []).map((id: any) => String(id));

      if (!adminIDs.includes(botId)) {
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ❌ NO PERMISSION
┗━━━━━━━━━━━━━━━━━━━━━┛
Bot must be admin to promote users.`);
        return;
      }

      if (!participantIDs.includes(targetId)) {
        await reply(`┏━━━━━━━━━━━━━━━━━━━┓
┃  ❌ ERROR
┗━━━━━━━━━━━━━━━━━━━┛
User is not in this group.`);
        return;
      }

      if (adminIDs.includes(targetId)) {
        await reply(`┏━━━━━━━━━━━━━━━━━━━┓
┃  ℹ️ INFO
┗━━━━━━━━━━━━━━━━━━━┛
This user is already an admin.`);
        return;
      }

      const userInfo = await safeGetUserInfo(api, targetId);
      const userName = userInfo[targetId]?.name || 'Unknown User';

      await api.changeAdminStatus(threadId, targetId, true);

      const timestamp = new Date().toLocaleString('en-PH', {
        timeZone: 'Asia/Manila',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      BotLogger.info(`Promoted ${targetId} (${userName}) to admin in ${threadId}`);

      await reply(`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  👑 USER PROMOTED
┗━━━━━━━━━━━━━━━━━━━━━┛

👤 Name: ${userName}
🆔 ID: ${targetId}
⏰ Time: ${timestamp}

User is now a group admin!`);
    } catch (err: any) {
      BotLogger.error(`Failed to promote user ${targetId}`, err);
      
      let errorMsg = 'Failed to promote user.';
      if (err?.message?.includes('permission')) {
        errorMsg = 'Bot lacks permission to promote users.';
      } else if (err?.message?.includes('not found')) {
        errorMsg = 'User not found in group.';
      }
      
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ❌ PROMOTE FAILED
┗━━━━━━━━━━━━━━━━━━━━━┛

${errorMsg}

Possible reasons:
• User is not in the group
• Bot is not admin
• Facebook API error`);
    }
  }
};

export default command;
