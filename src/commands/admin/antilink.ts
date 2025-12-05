import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { database } from '../../database/index.js';
import { decorations } from '../../lib/messageFormatter.js';

const command: Command = {
  name: 'antilink',
  aliases: ['nolink', 'linkfilter'],
  description: 'Toggle anti-link protection (blocks malicious links)',
  category: 'admin',
  usage: 'antilink <on|off>',
  examples: ['antilink on', 'antilink off'],
  adminOnly: true,
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { event, args, reply, prefix } = context;
    
    const option = args[0]?.toLowerCase();
    
    const antilinkKey = `antilink_${event.threadID}`;
    const currentSetting = await database.getSetting<string>(antilinkKey);
    const isEnabled = currentSetting === 'true';
    
    if (!option || !['on', 'off'].includes(option)) {
      await reply(`🔗 『 ANTI-LINK 』 🔗
═══════════════════════════
${decorations.fire} Link Protection
═══════════════════════════

◈ CURRENT STATUS
═══════════════════════════
➤ Anti-Link: ${isEnabled ? '🟢 ON' : '🔴 OFF'}

◈ USAGE
═══════════════════════════
➤ ${prefix}antilink on
➤ ${prefix}antilink off

◈ FEATURES
═══════════════════════════
• Blocks suspicious links
• Phishing detection
• Malware URL filtering
• Warns link posters`);
      return;
    }
    
    const enable = option === 'on';
    
    try {
      await database.setSetting(antilinkKey, String(enable));
      
      BotLogger.info(`Anti-link ${enable ? 'enabled' : 'disabled'} for group ${event.threadID}`);
      
      await reply(`🔗 『 ANTI-LINK ${enable ? 'ENABLED' : 'DISABLED'} 』 🔗
═══════════════════════════
${decorations.fire} Setting Updated
═══════════════════════════

◈ STATUS
═══════════════════════════
➤ Anti-Link: ${enable ? '🟢 ON' : '🔴 OFF'}

═══════════════════════════
${enable ? '✅ Link protection is now active' : '⚠️ Link protection is now disabled'}`);
    } catch (err) {
      BotLogger.error('Failed to toggle anti-link', err);
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Failed to update setting`);
    }
  }
};

export default command;
