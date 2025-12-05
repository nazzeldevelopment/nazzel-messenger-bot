import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { database } from '../../database/index.js';
import { decorations } from '../../lib/messageFormatter.js';

const command: Command = {
  name: 'activitylog',
  aliases: ['activity', 'auditlog', 'history'],
  description: 'View recent activity in the group',
  category: 'admin',
  usage: 'activitylog [limit]',
  examples: ['activitylog', 'activitylog 20'],
  adminOnly: true,
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { event, args, reply, prefix } = context;
    
    const limit = Math.min(parseInt(args[0]) || 10, 50);
    
    try {
      const logs = await database.getLogs({ 
        limit,
        type: 'command'
      });
      
      const groupLogs = logs.filter(log => log.threadId === String(event.threadID));
      
      if (groupLogs.length === 0) {
        await reply(`📋 『 ACTIVITY LOG 』 📋
═══════════════════════════
${decorations.fire} No Recent Activity
═══════════════════════════

ℹ️ No activity recorded for this group yet.

═══════════════════════════
💡 Activities are logged automatically`);
        return;
      }
      
      let logList = '';
      for (const log of groupLogs.slice(0, 15)) {
        const time = new Date(log.timestamp).toLocaleString('en-US', {
          timeZone: 'Asia/Manila',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        const level = log.level === 'error' ? '❌' : log.level === 'warn' ? '⚠️' : '✅';
        logList += `${level} ${time}\n   └─ ${log.message?.substring(0, 40) || 'Action'}${log.message?.length > 40 ? '...' : ''}\n`;
      }
      
      await reply(`📋 『 ACTIVITY LOG 』 📋
═══════════════════════════
${decorations.fire} Recent Activity
═══════════════════════════

${logList}
═══════════════════════════
📊 Showing ${groupLogs.slice(0, 15).length} entries
💡 Use ${prefix}activitylog 20 for more`);
      
      BotLogger.info(`Viewed activity log for group ${event.threadID}`);
    } catch (err) {
      BotLogger.error(`Failed to get activity log for group ${event.threadID}`, err);
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Failed to get activity log`);
    }
  }
};

export default command;
