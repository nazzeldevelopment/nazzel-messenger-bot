import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { database } from '../../database/index.js';
import { decorations } from '../../lib/messageFormatter.js';
import { commandHandler } from '../../lib/commandHandler.js';

const command: Command = {
  name: 'setcooldown',
  aliases: ['cooldown', 'setcd'],
  description: 'Set custom cooldown for a command in this group',
  category: 'admin',
  usage: 'setcooldown <command> <seconds>',
  examples: ['setcooldown joke 10', 'setcooldown gamble 30', 'setcooldown play reset'],
  adminOnly: true,
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { event, args, reply, prefix } = context;
    
    if (args.length < 2) {
      await reply(`⏱️ 『 SET COOLDOWN 』 ⏱️
═══════════════════════════
${decorations.fire} Custom Command Cooldowns
═══════════════════════════

◈ USAGE
═══════════════════════════
➤ ${prefix}setcooldown <cmd> <sec>
➤ ${prefix}setcooldown <cmd> reset

◈ EXAMPLE
═══════════════════════════
➤ ${prefix}setcooldown joke 10
➤ ${prefix}setcooldown gamble 30
➤ ${prefix}setcooldown play reset

◈ LIMITS
═══════════════════════════
➤ Minimum: 1 second
➤ Maximum: 300 seconds`);
      return;
    }
    
    const cmdName = args[0].toLowerCase();
    const cooldownArg = args[1].toLowerCase();
    
    const cmd = commandHandler.getCommand(cmdName);
    if (!cmd) {
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Command "${cmdName}" not found`);
      return;
    }
    
    try {
      const cooldownKey = `cooldown_${event.threadID}_${cmd.name}`;
      
      if (cooldownArg === 'reset' || cooldownArg === 'default') {
        await database.deleteSetting(cooldownKey);
        
        BotLogger.info(`Reset cooldown for ${cmd.name} in group ${event.threadID}`);
        
        await reply(`⏱️ 『 COOLDOWN RESET 』 ⏱️
═══════════════════════════
${decorations.fire} Reset to Default
═══════════════════════════

◈ COMMAND
═══════════════════════════
📝 Command: ${prefix}${cmd.name}
⏱️ Cooldown: Default

═══════════════════════════
✅ Using default cooldown now`);
        return;
      }
      
      const seconds = parseInt(cooldownArg);
      
      if (isNaN(seconds) || seconds < 1 || seconds > 300) {
        await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Invalid cooldown value
💡 Use 1-300 seconds or "reset"`);
        return;
      }
      
      await database.setSetting(cooldownKey, String(seconds * 1000));
      
      BotLogger.info(`Set cooldown for ${cmd.name} to ${seconds}s in group ${event.threadID}`);
      
      await reply(`⏱️ 『 COOLDOWN SET 』 ⏱️
═══════════════════════════
${decorations.fire} Custom Cooldown Applied
═══════════════════════════

◈ COMMAND
═══════════════════════════
📝 Command: ${prefix}${cmd.name}
⏱️ New Cooldown: ${seconds} seconds

═══════════════════════════
✅ Custom cooldown is now active`);
    } catch (err) {
      BotLogger.error(`Failed to set cooldown for ${cmdName}`, err);
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Failed to set cooldown`);
    }
  }
};

export default command;
