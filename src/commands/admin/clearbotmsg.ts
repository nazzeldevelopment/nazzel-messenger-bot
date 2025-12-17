import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';
import { logger } from '../../lib/logger.js';

const command: Command = {
  name: 'clearbotmsg',
  aliases: ['clearbotmsgs', 'deletebotmsg', 'removebotmsg', 'clearbot'],
  description: 'Delete all bot messages in this group',
  category: 'admin',
  usage: 'clearbotmsg [count]',
  examples: ['clearbotmsg', 'clearbotmsg 10'],
  adminOnly: true,
  cooldown: 30000,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, reply, args } = context;
    const threadId = String(event.threadID);
    const botId = String(api.getCurrentUserID());

    try {
      const maxToDelete = args[0] ? parseInt(args[0]) : 100;
      const limit = Math.min(Math.max(1, maxToDelete), 100);

      await reply(`╭─────────────────╮
│ 🔄 Clearing Bot Messages
╰─────────────────╯
Please wait...`);

      const botMessagesKey = `bot_messages_${threadId}`;
      const storedMessages = await database.getSetting<string[]>(botMessagesKey) || [];
      
      if (storedMessages.length === 0) {
        await reply(`╭─────────────────╮
│ ℹ️ No Messages Found
╰─────────────────╯
No bot messages to delete.

💡 Tip: Bot tracks its own messages
sent after this feature was enabled.`);
        return;
      }

      const messagesToDelete = storedMessages.slice(-limit);
      let deletedCount = 0;
      let failedCount = 0;

      for (const messageId of messagesToDelete) {
        try {
          await api.unsendMessage(messageId);
          deletedCount++;
          await new Promise(r => setTimeout(r, 150));
        } catch (e) {
          failedCount++;
        }
      }

      const remainingMessages = storedMessages.filter(
        (id) => !messagesToDelete.includes(id)
      );
      await database.setSetting(botMessagesKey, remainingMessages);

      const timestamp = new Date().toLocaleString('en-PH', {
        timeZone: 'Asia/Manila',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      await reply(`╭─────────────────╮
│ 🗑️ Messages Cleared
╰─────────────────╯

✅ Deleted: ${deletedCount}
❌ Failed: ${failedCount}
📝 Remaining: ${remainingMessages.length}

⏰ ${timestamp}
╭─────────────────╮
│ 💗 Wisdom Bot
╰─────────────────╯`);

      logger.info('Bot messages cleared', { 
        threadId, 
        deleted: deletedCount, 
        failed: failedCount,
        remaining: remainingMessages.length 
      });
    } catch (error) {
      logger.error('Failed to clear bot messages', { error });
      await reply(`╭─────────────────╮
│ ❌ Clear Failed
╰─────────────────╯
Failed to clear messages.
Please try again later.`);
    }
  }
};

export default command;
