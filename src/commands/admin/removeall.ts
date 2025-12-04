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
    const { api, event, reply, args } = context;
    const threadId = String(event.threadID);
    const botId = String(api.getCurrentUserID());
    
    if (args[0] !== 'confirm') {
      await reply(`⚠️ REMOVE ALL
━━━━━━━━━━━━━━━
🚨 This will remove ALL members!
━━━━━━━━━━━━━━━
Type: N!removeall confirm`);
      return;
    }
    
    try {
      const threadInfo = await api.getThreadInfo(threadId);
      const participants = threadInfo.participantIDs || [];
      
      const toRemove = participants.filter((id: string) => 
        String(id) !== botId && String(id) !== String(event.senderID)
      );
      
      if (toRemove.length === 0) {
        await reply(`ℹ️ No members to remove.`);
        return;
      }
      
      await reply(`🔄 REMOVING
━━━━━━━━━━━━━━━
📊 Members: ${toRemove.length}
⏳ Please wait...`);
      
      let removed = 0;
      let failed = 0;
      
      for (const userId of toRemove) {
        try {
          await api.removeUserFromGroup(String(userId), threadId);
          removed++;
          await new Promise(r => setTimeout(r, 1500));
        } catch (e) {
          failed++;
          BotLogger.debug(`Failed to remove ${userId}`);
        }
      }
      
      await reply(`✅ COMPLETED
━━━━━━━━━━━━━━━
✓ Removed: ${removed}
✗ Failed: ${failed}
━━━━━━━━━━━━━━━`);
      
      BotLogger.info(`RemoveAll: Removed ${removed}/${toRemove.length} from ${threadId}`);
      
    } catch (err) {
      BotLogger.error('RemoveAll failed', err);
      await reply(`❌ Failed to remove members.`);
    }
  }
};

export default command;
