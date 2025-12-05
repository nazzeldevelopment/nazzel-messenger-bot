import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';

const command: Command = {
  name: 'removeall',
  aliases: ['kickall', 'cleargroup'],
  description: 'Remove all non-admin members from the group (Owner only)',
  category: 'admin',
  usage: 'removeall [confirm]',
  examples: ['removeall', 'removeall confirm'],
  cooldown: 60000,
  ownerOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, reply, args, prefix } = context;
    const threadId = String(event.threadID);
    const botId = String(api.getCurrentUserID());
    const senderId = String(event.senderID);
    
    let threadInfo: any = null;
    let groupName = 'Unknown Group';
    let adminIDs: string[] = [];
    
    try {
      threadInfo = await api.getThreadInfo(threadId);
      groupName = threadInfo.threadName || threadInfo.name || 'Unknown Group';
      adminIDs = (threadInfo.adminIDs || []).map((a: any) => String(a.id || a));
      
      const isGroup = threadInfo.isGroup || 
                      threadInfo.threadType === 2 || 
                      (threadInfo.participantIDs && threadInfo.participantIDs.length > 2) ||
                      (threadInfo.participants && threadInfo.participants.length > 2);
      
      if (!isGroup) {
        await reply(`╭─────────────────╮
│ ❌ ERROR
╰─────────────────╯
This command only works
in group chats!`);
        return;
      }
      
      if (!adminIDs.includes(botId)) {
        await reply(`╭─────────────────╮
│ ❌ NO PERMISSION
╰─────────────────╯
Bot must be admin to
remove members!

💡 Make bot admin first.`);
        return;
      }
    } catch (e) {
      BotLogger.error('RemoveAll: Failed to get thread info', e);
      await reply(`╭─────────────────╮
│ ❌ ERROR
╰─────────────────╯
Could not get group info.
Please try again later.`);
      return;
    }
    
    const participants = threadInfo.participantIDs || 
                        (threadInfo.participants?.map((p: any) => p.userID || p.id)) || 
                        [];
    
    const toRemove = participants.filter((id: string) => {
      const idStr = String(id);
      return idStr !== botId && idStr !== senderId && !adminIDs.includes(idStr);
    });
    
    const memberCount = participants.length;
    const shortGroupName = groupName.length > 15 ? groupName.substring(0, 12) + '...' : groupName;
    
    if (args[0]?.toLowerCase() !== 'confirm') {
      await reply(`╭─────────────────╮
│ ⚠️ REMOVE ALL
╰─────────────────╯

📛 ${shortGroupName}
👥 Total: ${memberCount}
🎯 To Remove: ${toRemove.length}
🛡️ Protected: ${adminIDs.length}

⚠️ This will kick all
non-admin members!

💡 Type:
${prefix}removeall confirm

╭─────────────────╮
│ 💗 Wisdom Bot
╰─────────────────╯`);
      return;
    }
    
    if (toRemove.length === 0) {
      await reply(`╭─────────────────╮
│ ℹ️ INFO
╰─────────────────╯
No members to remove!
Only admins remain.`);
      return;
    }
    
    await reply(`╭─────────────────╮
│ 🔄 REMOVING...
╰─────────────────╯

📛 ${shortGroupName}
👥 Removing: ${toRemove.length}
⏳ Est: ~${Math.ceil(toRemove.length * 1.5)}s

Please wait...`);
    
    let removed = 0;
    let failed = 0;
    
    for (const userId of toRemove) {
      const userIdStr = String(userId);
      try {
        await new Promise<void>((resolve, reject) => {
          api.removeUserFromGroup(userIdStr, threadId, (err: any) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
        removed++;
        BotLogger.debug(`Successfully removed ${userIdStr} from ${threadId}`);
      } catch (e: any) {
        failed++;
        BotLogger.debug(`Failed to remove ${userIdStr}: ${e.message || e}`);
      }
      await new Promise(r => setTimeout(r, 1200));
    }
    
    const successRate = toRemove.length > 0 ? Math.round((removed / toRemove.length) * 100) : 0;
    const statusEmoji = successRate >= 80 ? '✅' : successRate >= 50 ? '⚠️' : '❌';
    
    const timestamp = new Date().toLocaleString('en-PH', {
      timeZone: 'Asia/Manila',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    await reply(`╭─────────────────╮
│ ${statusEmoji} COMPLETED
╰─────────────────╯

✓ Removed: ${removed}
✗ Failed: ${failed}
📈 Success: ${successRate}%

⏰ ${timestamp}
${removed > 0 ? '🎯 Operation completed!' : '⚠️ No members removed!'}
${failed > 0 ? `💡 ${failed} may be admins/left` : ''}

╭─────────────────╮
│ 💗 Wisdom Bot
╰─────────────────╯`);
    
    BotLogger.info(`RemoveAll: Removed ${removed}/${toRemove.length} from ${threadId} (${groupName})`);
  }
};

export default command;
