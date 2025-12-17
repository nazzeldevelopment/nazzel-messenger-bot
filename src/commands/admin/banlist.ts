import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';
import { safeGetUserInfo } from '../../lib/apiHelpers.js';
import { BotLogger } from '../../lib/logger.js';

const command: Command = {
  name: 'banlist',
  aliases: ['banned', 'listbans', 'bans'],
  description: 'Check if a specific user is banned from the bot',
  category: 'admin',
  usage: 'banlist [userID]',
  examples: ['banlist', 'banlist 123456789'],
  cooldown: 5000,
  adminOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { api, args, reply, prefix } = context;

    if (!args[0]) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 CHECK BAN STATUS
┗━━━━━━━━━━━━━━━━━━━━━┛

Check if a user is banned from using bot commands.

📝 Usage: ${prefix}banlist <userID>
📝 Example: ${prefix}banlist 100012345678901`);
      return;
    }

    const targetId = String(args[0].replace(/[^0-9]/g, ''));

    if (!targetId || targetId.length < 5) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━┓
┃  ❌ ERROR
┗━━━━━━━━━━━━━━━━━━━┛
Invalid user ID. Please provide a valid Facebook user ID.`);
      return;
    }

    try {
      const banData = await database.getSetting(`banned_${targetId}`);
      const userInfo = await safeGetUserInfo(api, targetId);
      const userName = userInfo[targetId]?.name || 'Unknown User';

      if (!banData) {
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  ✅ NOT BANNED
┗━━━━━━━━━━━━━━━━━━━━━┛

👤 Name: ${userName}
🆔 ID: ${targetId}

This user is NOT banned.`);
        return;
      }

      const parsed = typeof banData === 'string' ? JSON.parse(banData) : banData;
      const banDate = parsed.timestamp 
        ? new Date(parsed.timestamp).toLocaleString('en-PH', { 
            timeZone: 'Asia/Manila',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
        : 'Unknown';

      await reply(`┏━━━━━━━━━━━━━━━━━━━━━┓
┃  🚫 USER BANNED
┗━━━━━━━━━━━━━━━━━━━━━┛

👤 Name: ${userName}
🆔 ID: ${targetId}
📝 Reason: ${parsed.reason || 'No reason provided'}
📅 Banned: ${banDate}

💡 Use ${prefix}unban ${targetId} to remove ban.`);

    } catch (error) {
      BotLogger.error('Failed to check ban status', error);
      await reply(`┏━━━━━━━━━━━━━━━━━━━┓
┃  ❌ ERROR
┗━━━━━━━━━━━━━━━━━━━┛
Failed to check ban status. Please try again.`);
    }
  }
};

export default command;
