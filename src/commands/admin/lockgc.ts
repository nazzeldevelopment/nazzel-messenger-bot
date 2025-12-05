import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { database } from '../../database/index.js';

const command: Command = {
  name: 'lockgc',
  aliases: ['lock', 'lockchat'],
  description: 'Lock the group chat (only admins can send messages)',
  category: 'admin',
  usage: 'lockgc',
  examples: ['lockgc'],
  adminOnly: true,
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { event, reply, prefix } = context;
    
    try {
      const lockKey = `locked_${event.threadID}`;
      const isLocked = await database.getSetting(lockKey);
      
      if (isLocked === 'true') {
        await reply(`╔══════════════════════════╗
║   🔒 ALREADY LOCKED 🔒   ║
╠══════════════════════════╣
║ This group is already    ║
║ locked!                  ║
╠══════════════════════════╣
║ 💡 ${prefix}unlockgc to unlock ║
╚══════════════════════════╝`);
        return;
      }
      
      await database.setSetting(lockKey, 'true');
      
      const timestamp = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      
      BotLogger.info(`Locked group ${event.threadID}`);
      
      await reply(`╔══════════════════════════╗
║   🔒 GROUP LOCKED 🔒   ║
╠══════════════════════════╣
║ 🔥 Chat Restricted       ║
╠══════════════════════════╣
║ ◈ STATUS                 ║
╠══════════════════════════╣
║ 🔒 Mode: LOCKED          ║
║ 👥 Chat: Admins Only     ║
║ ⏰ ${timestamp.substring(0, 20)}   ║
╠══════════════════════════╣
║ ◈ NOTE                   ║
╠══════════════════════════╣
║ Non-admin messages will  ║
║ be ignored by the bot.   ║
╠══════════════════════════╣
║ 💡 ${prefix}unlockgc to unlock ║
╚══════════════════════════╝`);
    } catch (err) {
      BotLogger.error(`Failed to lock group ${event.threadID}`, err);
      await reply(`╔══════════════════════════╗
║      ❌ ERROR ❌      ║
╠══════════════════════════╣
║ Failed to lock group     ║
╚══════════════════════════╝`);
    }
  }
};

export default command;
