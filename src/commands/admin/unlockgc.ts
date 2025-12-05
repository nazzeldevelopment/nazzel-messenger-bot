import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { database } from '../../database/index.js';
import { decorations } from '../../lib/messageFormatter.js';

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
        await reply(`${decorations.fire} 『 NOT LOCKED 』
═══════════════════════════
🔓 This group is not locked
💡 Use ${prefix}lockgc to lock`);
        return;
      }
      
      await database.deleteSetting(lockKey);
      
      const timestamp = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      
      BotLogger.info(`Unlocked group ${event.threadID}`);
      
      await reply(`🔓 『 GROUP UNLOCKED 』 🔓
═══════════════════════════
${decorations.fire} Chat Opened
═══════════════════════════

◈ STATUS
═══════════════════════════
🔓 Mode: UNLOCKED
👥 Who can chat: Everyone
⏰ Time: ${timestamp}

═══════════════════════════
${decorations.sparkle} Everyone can chat now!`);
    } catch (err) {
      BotLogger.error(`Failed to unlock group ${event.threadID}`, err);
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Failed to unlock group`);
    }
  }
};

export default command;
