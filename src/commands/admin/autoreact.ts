import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { database } from '../../database/index.js';
import { decorations } from '../../lib/messageFormatter.js';

const command: Command = {
  name: 'autoreact',
  aliases: ['react', 'autoemoji'],
  description: 'Toggle automatic reactions to messages',
  category: 'admin',
  usage: 'autoreact <on|off>',
  examples: ['autoreact on', 'autoreact off'],
  adminOnly: true,
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { event, args, reply, prefix } = context;
    
    const option = args[0]?.toLowerCase();
    
    const reactKey = `autoreact_${event.threadID}`;
    const currentSetting = await database.getSetting<string>(reactKey);
    const isEnabled = currentSetting === 'true';
    
    if (!option || !['on', 'off'].includes(option)) {
      await reply(`😊 『 AUTO REACT 』 😊
═══════════════════════════
${decorations.fire} Automatic Reactions
═══════════════════════════

◈ CURRENT STATUS
═══════════════════════════
➤ Auto React: ${isEnabled ? '🟢 ON' : '🔴 OFF'}

◈ USAGE
═══════════════════════════
➤ ${prefix}autoreact on
➤ ${prefix}autoreact off

◈ FEATURES
═══════════════════════════
• React to keywords
• Random emoji reactions
• Mood-based reactions`);
      return;
    }
    
    const enable = option === 'on';
    
    try {
      await database.setSetting(reactKey, String(enable));
      
      BotLogger.info(`Auto-react ${enable ? 'enabled' : 'disabled'} for group ${event.threadID}`);
      
      await reply(`😊 『 AUTO REACT ${enable ? 'ENABLED' : 'DISABLED'} 』 😊
═══════════════════════════
${decorations.fire} Setting Updated
═══════════════════════════

◈ STATUS
═══════════════════════════
➤ Auto React: ${enable ? '🟢 ON' : '🔴 OFF'}

═══════════════════════════
${enable ? '✅ Bot will react to messages' : '⚠️ Auto reactions disabled'}`);
    } catch (err) {
      BotLogger.error('Failed to toggle auto-react', err);
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Failed to update setting`);
    }
  }
};

export default command;
