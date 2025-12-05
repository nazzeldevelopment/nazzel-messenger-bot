import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';

const command: Command = {
  name: 'removeall',
  aliases: ['kickall', 'cleargroup'],
  description: 'Remove all members from the group (Owner only)',
  category: 'admin',
  usage: 'removeall',
  examples: ['removeall'],
  cooldown: 60000,
  ownerOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, reply, args, prefix } = context;
    const threadId = String(event.threadID);
    const botId = String(api.getCurrentUserID());
    const senderId = String(event.senderID);
    
    let threadInfo: any = null;
    let groupName = 'Unknown Group';
    
    try {
      threadInfo = await api.getThreadInfo(threadId);
      groupName = threadInfo.threadName || threadInfo.name || 'Unknown Group';
      
      const isGroup = threadInfo.isGroup || 
                      threadInfo.threadType === 2 || 
                      (threadInfo.participantIDs && threadInfo.participantIDs.length > 2) ||
                      (threadInfo.participants && threadInfo.participants.length > 2);
      
      if (!isGroup) {
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ❌ 𝗘𝗥𝗥𝗢𝗥 ❌     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ This command only works in group chats!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Use this in a group conversation`);
        return;
      }
    } catch (e) {
      BotLogger.error('RemoveAll: Failed to get thread info', e);
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ❌ 𝗘𝗥𝗥𝗢𝗥 ❌     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ Could not get group information.
Please try again later.`);
      return;
    }
    
    const participants = threadInfo.participantIDs || 
                        (threadInfo.participants?.map((p: any) => p.userID || p.id)) || 
                        [];
    
    const memberCount = participants.length;
    
    if (args[0] !== 'confirm') {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   ⚠️ 𝗥𝗘𝗠𝗢𝗩𝗘 𝗔𝗟𝗟 ⚠️   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌─────────────────────────────┐
│ 📛 Group: ${groupName.substring(0, 20)}
│ 👥 Members: ${memberCount}
└─────────────────────────────┘

🚨 WARNING: This will remove ALL members!
⚠️ This action cannot be undone!

┌── 𝗧𝗼 𝗖𝗼𝗻𝗳𝗶𝗿𝗺 ──┐
│ ${prefix}removeall confirm
└─────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏳ You have 60 seconds to confirm`);
      return;
    }
    
    try {
      const toRemove = participants.filter((id: string) => 
        String(id) !== botId && String(id) !== senderId
      );
      
      if (toRemove.length === 0) {
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ℹ️ 𝗜𝗡𝗙𝗢 ℹ️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📋 No members to remove.
👥 Only you and the bot remain in the group.`);
        return;
      }
      
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🔄 𝗥𝗘𝗠𝗢𝗩𝗜𝗡𝗚... 🔄   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌─────────────────────────────┐
│ 📛 Group: ${groupName.substring(0, 20)}
│ 👥 Removing: ${toRemove.length} members
│ ⏳ Estimated: ~${Math.ceil(toRemove.length * 1.5)}s
└─────────────────────────────┘

Please wait...`);
      
      let removed = 0;
      let failed = 0;
      
      for (const userId of toRemove) {
        try {
          await api.removeUserFromGroup(String(userId), threadId);
          removed++;
          await new Promise(r => setTimeout(r, 1500));
        } catch (e: any) {
          failed++;
          BotLogger.debug(`Failed to remove ${userId}: ${e.message || e}`);
        }
      }
      
      const successRate = Math.round((removed / toRemove.length) * 100);
      const statusEmoji = successRate >= 80 ? '✅' : successRate >= 50 ? '⚠️' : '❌';
      
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   ${statusEmoji} 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘𝗗 ${statusEmoji}   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌── 📊 𝗥𝗲𝘀𝘂𝗹𝘁𝘀 ──┐
│ ✓ Removed: ${removed}
│ ✗ Failed: ${failed}
│ 📈 Success: ${successRate}%
└─────────────────────────────┘

${removed > 0 ? '🎯 Operation completed!' : '⚠️ No members were removed'}
${failed > 0 ? `💡 ${failed} members may have admin rights or left` : ''}`);
      
      BotLogger.info(`RemoveAll: Removed ${removed}/${toRemove.length} from ${threadId} (${groupName})`);
      
    } catch (err) {
      BotLogger.error('RemoveAll failed', err);
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ❌ 𝗘𝗥𝗥𝗢𝗥 ❌     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ Failed to remove members.

┌── 𝗣𝗼𝘀𝘀𝗶𝗯𝗹𝗲 𝗥𝗲𝗮𝘀𝗼𝗻𝘀 ──┐
│ • Bot is not admin
│ • Rate limited by Facebook
│ • Network error
└─────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Make sure bot has admin rights`);
    }
  }
};

export default command;
