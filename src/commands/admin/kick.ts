import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { safeGetThreadInfo, safeGetUserInfo } from '../../lib/apiHelpers.js';

const command: Command = {
  name: 'kick',
  aliases: ['boot'],
  description: 'Kick a member from the group chat',
  category: 'admin',
  usage: 'kick <@mention|userID>',
  examples: ['kick @user', 'kick 123456789'],
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
      await reply(`╭─────────────────╮
│ 🔨 KICK USER
╰─────────────────╯

Mention or provide user ID.

📝 Usage: ${prefix}kick @user
📝 Example: ${prefix}kick 12345

╭─────────────────╮
│ 💗 Wisdom Bot
╰─────────────────╯`);
      return;
    }
    
    if (targetId === String(event.senderID)) {
      await reply(`╭─────────────────╮
│ ❌ DENIED
╰─────────────────╯
You cannot kick yourself!`);
      return;
    }

    if (targetId === botId) {
      await reply(`╭─────────────────╮
│ ❌ DENIED
╰─────────────────╯
Cannot kick the bot itself!
Use ${prefix}leave instead.`);
      return;
    }
    
    try {
      const threadInfo = await safeGetThreadInfo(api, threadId);
      
      if (!threadInfo) {
        await reply(`╭─────────────────╮
│ ❌ ERROR
╰─────────────────╯
Unable to fetch group info.
Please try again later.`);
        return;
      }
      
      const adminIDs = (threadInfo.adminIDs || []).map((a: any) => String(a.id || a));
      
      if (!adminIDs.includes(botId)) {
        await reply(`╭─────────────────╮
│ ❌ NO PERMISSION
╰─────────────────╯
Bot must be admin to kick.
Please make bot admin first.`);
        return;
      }

      const userInfo = await safeGetUserInfo(api, targetId);
      const userName = userInfo[targetId]?.name || 'Unknown User';
      
      await api.removeUserFromGroup(targetId, threadId);
      
      const timestamp = new Date().toLocaleString('en-PH', {
        timeZone: 'Asia/Manila',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      BotLogger.info(`Kicked user ${targetId} (${userName}) from group ${threadId}`);
      
      await reply(`╭─────────────────╮
│ ✅ USER KICKED
╰─────────────────╯

👤 ${userName}
🆔 ${targetId}
⏰ ${timestamp}

Successfully removed!
╭─────────────────╮
│ 💗 Wisdom Bot
╰─────────────────╯`);
    } catch (err: any) {
      BotLogger.error(`Failed to kick user ${targetId}`, err);
      
      let errorMsg = 'Failed to remove user.';
      if (err?.message?.includes('admin')) {
        errorMsg = 'Cannot kick group admin.';
      } else if (err?.message?.includes('permission')) {
        errorMsg = 'Bot lacks admin permission.';
      }
      
      await reply(`╭─────────────────╮
│ ❌ KICK FAILED
╰─────────────────╯

${errorMsg}

Possible reasons:
• User is an admin
• User already left
• Bot not admin`);
    }
  }
};

export default command;
