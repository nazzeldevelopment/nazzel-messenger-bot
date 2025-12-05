import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { database } from '../../database/index.js';

const command: Command = {
  name: 'unlockgc',
  aliases: ['unlock', 'unlockchat'],
  description: 'Unlock the group chat (everyone can send messages)',
  category: 'admin',
  usage: 'unlockgc',
  examples: ['unlockgc'],
  adminOnly: true,
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { event, reply, prefix } = context;
    
    try {
      const lockKey = `locked_${event.threadID}`;
      const isLocked = await database.getSetting(lockKey);
      
      if (isLocked !== 'true') {
        await reply(`╔══════════════════════════╗
║   🔓 NOT LOCKED 🔓   ║
╠══════════════════════════╣
║ This group is not locked ║
╠══════════════════════════╣
║ 💡 ${prefix}lockgc to lock     ║
╚══════════════════════════╝`);
        return;
      }
      
      await database.deleteSetting(lockKey);
      
      const timestamp = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      
      BotLogger.info(`Unlocked group ${event.threadID}`);
      
      await reply(`╔══════════════════════════╗
║   🔓 GROUP UNLOCKED 🔓   ║
╠══════════════════════════╣
║ 🔥 Chat Opened           ║
╠══════════════════════════╣
║ ◈ STATUS                 ║
╠══════════════════════════╣
║ 🔓 Mode: UNLOCKED        ║
║ 👥 Chat: Everyone        ║
║ ⏰ ${timestamp.substring(0, 20)}   ║
╠══════════════════════════╣
║ ✨ Everyone can chat now!║
╚══════════════════════════╝`);
    } catch (err) {
      BotLogger.error(`Failed to unlock group ${event.threadID}`, err);
      await reply(`╔══════════════════════════╗
║      ❌ ERROR ❌      ║
╠══════════════════════════╣
║ Failed to unlock group   ║
╚══════════════════════════╝`);
    }
  }
};

export default command;
