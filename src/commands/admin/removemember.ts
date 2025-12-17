import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { safeGetThreadInfo, safeGetUserInfo } from '../../lib/apiHelpers.js';

const command: Command = {
  name: 'removemember',
  aliases: ['rmember', 'rmmember', 'remove'],
  description: 'Remove one or multiple members from the group',
  category: 'admin',
  usage: 'removemember <@mention|userID> [more users...]',
  examples: ['removemember @user', 'removemember @user1 @user2', 'removemember 123456'],
  adminOnly: true,
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, args, reply, prefix } = context;
    const threadId = String(event.threadID);
    const botId = String(api.getCurrentUserID());
    const senderId = String(event.senderID);
    
    const targetIds: string[] = [];
    
    if (event.mentions && Object.keys(event.mentions).length > 0) {
      for (const id of Object.keys(event.mentions)) {
        targetIds.push(String(id).trim());
      }
    }
    
    for (const arg of args) {
      if (/^\d+$/.test(arg) && !targetIds.includes(arg)) {
        targetIds.push(arg);
      }
    }
    
    if (targetIds.length === 0) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  👥 REMOVE MEMBER
┗━━━━━━━━━━━━━━━━━━━━━━━┛

Mention or provide user IDs to remove.

📝 Usage:
• ${prefix}removemember @user
• ${prefix}removemember @user1 @user2
• ${prefix}removemember 123456789`);
      return;
    }
    
    const validTargets = targetIds.filter(id => 
      id !== senderId && id !== botId
    );
    
    if (validTargets.length === 0) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━┓
┃  ❌ DENIED
┗━━━━━━━━━━━━━━━━━━━┛
Cannot remove yourself or the bot!`);
      return;
    }
    
    try {
      const threadInfo = await safeGetThreadInfo(api, threadId);
      const adminIDs = (threadInfo?.adminIDs || []).map((a: any) => String(a.id || a));
      
      if (!adminIDs.includes(botId)) {
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ❌ NO PERMISSION
┗━━━━━━━━━━━━━━━━━━━━━┛
Bot must be admin to remove members.
Please make bot admin first.`);
        return;
      }
      
      if (validTargets.length > 1) {
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  🔄 REMOVING...
┗━━━━━━━━━━━━━━━━━━━━━┛
Processing ${validTargets.length} users...`);
      }
      
      let removed = 0;
      let failed = 0;
      const results: { name: string; id: string; success: boolean }[] = [];
      
      for (const targetId of validTargets) {
        try {
          const userInfo = await safeGetUserInfo(api, targetId);
          const userName = userInfo[targetId]?.name || 'Unknown';
          
          await api.removeUserFromGroup(targetId, threadId);
          
          removed++;
          results.push({ name: userName, id: targetId, success: true });
          BotLogger.info(`Removed ${targetId} (${userName}) from ${threadId}`);
          
          if (validTargets.length > 1) {
            await new Promise(r => setTimeout(r, 800));
          }
        } catch (err: any) {
          failed++;
          try {
            const userInfo = await safeGetUserInfo(api, targetId);
            const userName = userInfo[targetId]?.name || targetId;
            results.push({ name: userName, id: targetId, success: false });
          } catch {
            results.push({ name: targetId, id: targetId, success: false });
          }
          BotLogger.error(`Failed to remove ${targetId}`, err);
        }
      }
      
      const timestamp = new Date().toLocaleString('en-PH', {
        timeZone: 'Asia/Manila',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      if (validTargets.length === 1) {
        const result = results[0];
        if (result.success) {
          await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ✅ MEMBER REMOVED
┗━━━━━━━━━━━━━━━━━━━━━━━┛

👤 Name: ${result.name}
🆔 ID: ${result.id}
⏰ Time: ${timestamp}

Successfully removed from group!`);
        } else {
          await reply(`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ❌ REMOVE FAILED
┗━━━━━━━━━━━━━━━━━━━━━┛

👤 ${result.name}

Possible reasons:
• User is a group admin
• User already left the group
• Invalid user ID`);
        }
      } else {
        const successList = results.filter(r => r.success).map(r => `✅ ${r.name}`);
        const failList = results.filter(r => !r.success).map(r => `❌ ${r.name}`);
        
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📊 REMOVE RESULTS
┗━━━━━━━━━━━━━━━━━━━━━━━┛

✅ Removed: ${removed}
❌ Failed: ${failed}

${successList.length > 0 ? successList.slice(0, 5).join('\n') : ''}
${successList.length > 5 ? `...and ${successList.length - 5} more` : ''}
${failList.length > 0 ? '\n' + failList.slice(0, 3).join('\n') : ''}

⏰ ${timestamp}`);
      }
    } catch (err: any) {
      BotLogger.error('Failed to remove members', err);
      await reply(`┏━━━━━━━━━━━━━━━━━━━┓
┃  ❌ ERROR
┗━━━━━━━━━━━━━━━━━━━┛
Failed to process removal. Please try again.`);
    }
  }
};

export default command;
