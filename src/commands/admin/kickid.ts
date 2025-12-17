import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { safeGetThreadInfo, safeGetUserInfo } from '../../lib/apiHelpers.js';

const command: Command = {
  name: 'kickid',
  aliases: ['removeid', 'bootid'],
  description: 'Remove a member from the group using their User ID',
  category: 'admin',
  usage: 'kickid <userID>',
  examples: ['kickid 123456789012345'],
  adminOnly: true,
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, args, reply, prefix } = context;
    const threadId = String(event.threadID);
    const botId = String(api.getCurrentUserID());
    
    if (!args[0] || !/^\d+$/.test(args[0])) {
      await reply(`╭─────────────────╮
│ 🔨 KICK BY ID
╰─────────────────╯

Remove user by Facebook ID.

📝 Usage: ${prefix}kickid <userID>
📝 Example: ${prefix}kickid 12345

╭─────────────────╮
│ 💗 Wisdom Bot
╰─────────────────╯`);
      return;
    }
    
    const targetId = String(args[0]).trim();
    
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
      const adminIDs = (threadInfo?.adminIDs || []).map((a: any) => String(a.id || a));
      
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
      
      await new Promise<void>((resolve, reject) => {
        api.removeUserFromGroup(targetId, threadId, (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      
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
• Invalid user ID
• Bot not admin`);
    }
  }
};

export default command;
