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
    
    try {
      const threadInfo = await api.getThreadInfo(threadId);
      if (!threadInfo.isGroup) {
        await reply(`╭──────────────────╮
│    ❌ ERROR      │
╰──────────────────╯
⚠️ This command only works in group chats!`);
        return;
      }
    } catch (e) {
      await reply(`╭──────────────────╮
│    ❌ ERROR      │
╰──────────────────╯
⚠️ Could not verify group information`);
      return;
    }
    
    if (args[0] !== 'confirm') {
      await reply(`╭─────────────────────╮
│  ⚠️ REMOVE ALL    │
╰─────────────────────╯
🚨 WARNING: This will remove ALL members from this group!

This action cannot be undone.

╭─ To confirm ─╮
│ ${prefix}removeall confirm │
╰──────────────╯`);
      return;
    }
    
    try {
      const threadInfo = await api.getThreadInfo(threadId);
      const participants = threadInfo.participantIDs || [];
      
      const toRemove = participants.filter((id: string) => 
        String(id) !== botId && String(id) !== senderId
      );
      
      if (toRemove.length === 0) {
        await reply(`╭──────────────────╮
│    ℹ️ INFO       │
╰──────────────────╯
📋 No members to remove.
👥 Only you and the bot remain.`);
        return;
      }
      
      await reply(`╭─────────────────────╮
│   🔄 REMOVING...   │
╰─────────────────────╯
📊 Total: ${toRemove.length} members
⏳ Please wait...`);
      
      let removed = 0;
      let failed = 0;
      
      for (const userId of toRemove) {
        try {
          await api.removeUserFromGroup(String(userId), threadId);
          removed++;
          await new Promise(r => setTimeout(r, 1200));
        } catch (e) {
          failed++;
          BotLogger.debug(`Failed to remove ${userId}`);
        }
      }
      
      await reply(`╭─────────────────────╮
│   ✅ COMPLETED     │
╰─────────────────────╯
📊 Results:
├─ ✓ Removed: ${removed}
└─ ✗ Failed: ${failed}

${removed > 0 ? '🎯 Operation successful!' : '⚠️ No members removed'}`);
      
      BotLogger.info(`RemoveAll: Removed ${removed}/${toRemove.length} from ${threadId}`);
      
    } catch (err) {
      BotLogger.error('RemoveAll failed', err);
      await reply(`╭──────────────────╮
│    ❌ ERROR      │
╰──────────────────╯
⚠️ Failed to remove members.
💡 Make sure bot has admin rights.`);
    }
  }
};

export default command;
