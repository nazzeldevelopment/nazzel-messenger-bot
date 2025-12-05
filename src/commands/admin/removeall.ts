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
        await reply(`╔══════════════════════════╗
║      ❌ ERROR ❌      ║
╠══════════════════════════╣
║ This command only works  ║
║ in group chats!          ║
╚══════════════════════════╝`);
        return;
      }
      
      // Check if bot is admin
      if (!adminIDs.includes(botId)) {
        await reply(`╔══════════════════════════╗
║      ❌ ERROR ❌      ║
╠══════════════════════════╣
║ Bot must be admin to     ║
║ remove members!          ║
╠══════════════════════════╣
║ 💡 Make bot admin first  ║
╚══════════════════════════╝`);
        return;
      }
    } catch (e) {
      BotLogger.error('RemoveAll: Failed to get thread info', e);
      await reply(`╔══════════════════════════╗
║      ❌ ERROR ❌      ║
╠══════════════════════════╣
║ Could not get group info ║
║ Please try again later   ║
╚══════════════════════════╝`);
      return;
    }
    
    const participants = threadInfo.participantIDs || 
                        (threadInfo.participants?.map((p: any) => p.userID || p.id)) || 
                        [];
    
    // Filter: remove everyone except bot, sender, and other admins
    const toRemove = participants.filter((id: string) => {
      const idStr = String(id);
      return idStr !== botId && idStr !== senderId && !adminIDs.includes(idStr);
    });
    
    const memberCount = participants.length;
    const shortGroupName = groupName.length > 18 ? groupName.substring(0, 15) + '...' : groupName;
    
    if (args[0] !== 'confirm') {
      await reply(`╔══════════════════════════╗
║   ⚠️ REMOVE ALL ⚠️   ║
╠══════════════════════════╣
║ 📛 ${shortGroupName.padEnd(20)}║
║ 👥 Total: ${String(memberCount).padEnd(14)}║
║ 🎯 To Remove: ${String(toRemove.length).padEnd(10)}║
║ 🛡️ Protected: ${String(adminIDs.length).padEnd(10)}║
╠══════════════════════════╣
║ 🚨 This will kick all    ║
║ non-admin members!       ║
╠══════════════════════════╣
║ 💡 ${prefix}removeall confirm ║
╚══════════════════════════╝`);
      return;
    }
    
    if (toRemove.length === 0) {
      await reply(`╔══════════════════════════╗
║      ℹ️ INFO ℹ️      ║
╠══════════════════════════╣
║ No members to remove!    ║
║ Only admins remain.      ║
╚══════════════════════════╝`);
      return;
    }
    
    await reply(`╔══════════════════════════╗
║   🔄 REMOVING... 🔄   ║
╠══════════════════════════╣
║ 📛 ${shortGroupName.padEnd(20)}║
║ 👥 Removing: ${String(toRemove.length).padEnd(11)}║
║ ⏳ Est: ~${String(Math.ceil(toRemove.length * 1.5)).padEnd(14)}s║
╠══════════════════════════╣
║ Please wait...           ║
╚══════════════════════════╝`);
    
    let removed = 0;
    let failed = 0;
    const failedUsers: string[] = [];
    
    for (const userId of toRemove) {
      const userIdStr = String(userId);
      try {
        // Use the correct API method with proper parameters
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
        failedUsers.push(userIdStr);
        BotLogger.debug(`Failed to remove ${userIdStr}: ${e.message || e}`);
      }
      // Wait between removals to avoid rate limiting
      await new Promise(r => setTimeout(r, 1200));
    }
    
    const successRate = toRemove.length > 0 ? Math.round((removed / toRemove.length) * 100) : 0;
    const statusEmoji = successRate >= 80 ? '✅' : successRate >= 50 ? '⚠️' : '❌';
    
    await reply(`╔══════════════════════════╗
║   ${statusEmoji} COMPLETED ${statusEmoji}   ║
╠══════════════════════════╣
║ ✓ Removed: ${String(removed).padEnd(13)}║
║ ✗ Failed: ${String(failed).padEnd(14)}║
║ 📈 Success: ${String(successRate).padEnd(12)}%║
╠══════════════════════════╣
${removed > 0 ? '║ 🎯 Operation completed!  ║' : '║ ⚠️ No members removed!   ║'}
${failed > 0 ? `║ 💡 ${failed} may be admins/left  ║` : ''}
╚══════════════════════════╝`);
    
    BotLogger.info(`RemoveAll: Removed ${removed}/${toRemove.length} from ${threadId} (${groupName})`);
  }
};

export default command;
