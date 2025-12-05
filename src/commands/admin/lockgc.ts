import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { database } from '../../database/index.js';
import { decorations } from '../../lib/messageFormatter.js';

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
        await reply(`${decorations.fire} 『 ALREADY LOCKED 』
═══════════════════════════
🔒 This group is already locked
💡 Use ${prefix}unlockgc to unlock`);
        return;
      }
      
      await database.setSetting(lockKey, 'true');
      
      const timestamp = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Manila',
        dateStyle: 'medium',
        timeStyle: 'short'
      });
      
      BotLogger.info(`Locked group ${event.threadID}`);
      
      await reply(`🔒 『 GROUP LOCKED 』 🔒
═══════════════════════════
${decorations.fire} Chat Restricted
═══════════════════════════

◈ STATUS
═══════════════════════════
🔒 Mode: LOCKED
👥 Who can chat: Admins Only
⏰ Time: ${timestamp}

◈ NOTE
═══════════════════════════
Non-admin messages will be
handled by the bot moderator.

═══════════════════════════
💡 Use ${prefix}unlockgc to unlock`);
    } catch (err) {
      BotLogger.error(`Failed to lock group ${event.threadID}`, err);
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Failed to lock group`);
    }
  }
};

export default command;
