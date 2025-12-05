import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';
import { logger } from '../../lib/logger.js';

const command: Command = {
  name: 'clearbotmsg',
  aliases: ['clearbotmsgs', 'deletebotmsg', 'removebotmsg'],
  description: 'Delete all bot messages in this group',
  category: 'admin',
  usage: 'clearbotmsg',
  examples: ['clearbotmsg'],
  adminOnly: true,
  cooldown: 30000,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, reply } = context;
    const threadId = event.threadID;
    const botId = api.getCurrentUserID();

    try {
      await reply(`🔄 Deleting bot messages...`);

      const botMessagesKey = `bot_messages_${threadId}`;
      const storedMessages = await database.getSetting<string[]>(botMessagesKey) || [];
      
      let deletedCount = 0;
      let failedCount = 0;

      for (const messageId of storedMessages) {
        try {
          await new Promise<void>((resolve, reject) => {
            api.unsendMessage(messageId, (err: any) => {
              if (err) reject(err);
              else resolve();
            });
          });
          deletedCount++;
          await new Promise(r => setTimeout(r, 100));
        } catch (e) {
          failedCount++;
        }
      }

      await database.setSetting(botMessagesKey, []);

      await reply(`╭─────────────────╮
│ 🗑️ Clear Bot Messages
╰─────────────────╯

✅ Deleted: ${deletedCount}
❌ Failed: ${failedCount}

Bot messages cleared.`);

      logger.info('Bot messages cleared', { threadId, deleted: deletedCount, failed: failedCount });
    } catch (error) {
      logger.error('Failed to clear bot messages', { error });
      await reply(`❌ Failed to clear messages.`);
    }
  }
};

export default command;
