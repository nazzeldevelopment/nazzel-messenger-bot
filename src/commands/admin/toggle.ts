import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { database } from '../../database/index.js';
import { decorations } from '../../lib/messageFormatter.js';
import { commandHandler } from '../../lib/commandHandler.js';

const command: Command = {
  name: 'toggle',
  aliases: ['enable', 'disable', 'togglecmd'],
  description: 'Enable or disable a command in this group',
  category: 'admin',
  usage: 'toggle <command> [on|off]',
  examples: ['toggle joke off', 'toggle 8ball on', 'toggle gamble'],
  adminOnly: true,
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { event, args, reply, prefix } = context;
    
    if (!args[0]) {
      await reply(`🔄 『 TOGGLE COMMAND 』 🔄
═══════════════════════════
${decorations.fire} Enable/Disable Commands
═══════════════════════════

◈ USAGE
═══════════════════════════
➤ ${prefix}toggle <command> on
➤ ${prefix}toggle <command> off
➤ ${prefix}toggle <command>

◈ EXAMPLE
═══════════════════════════
➤ ${prefix}toggle joke off
➤ ${prefix}toggle gamble on`);
      return;
    }
    
    const cmdName = args[0].toLowerCase();
    const action = args[1]?.toLowerCase();
    
    const cmd = commandHandler.getCommand(cmdName);
    if (!cmd) {
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Command "${cmdName}" not found`);
      return;
    }
    
    if (cmd.name === 'toggle' || cmd.name === 'help') {
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Cannot toggle this command`);
      return;
    }
    
    try {
      const toggleKey = `disabled_${event.threadID}_${cmd.name}`;
      const currentState = await database.getSetting<string>(toggleKey);
      const isDisabled = currentState === 'true';
      
      let newState: boolean;
      if (action === 'on') {
        newState = false;
      } else if (action === 'off') {
        newState = true;
      } else {
        newState = !isDisabled;
      }
      
      if (newState) {
        await database.setSetting(toggleKey, 'true');
      } else {
        await database.deleteSetting(toggleKey);
      }
      
      const statusEmoji = newState ? '🔴' : '🟢';
      const statusText = newState ? 'DISABLED' : 'ENABLED';
      
      BotLogger.info(`Toggled command ${cmd.name} to ${statusText} for group ${event.threadID}`);
      
      await reply(`🔄 『 COMMAND ${statusText} 』 🔄
═══════════════════════════
${decorations.fire} Toggle Updated
═══════════════════════════

◈ COMMAND
═══════════════════════════
📝 Command: ${prefix}${cmd.name}
${statusEmoji} Status: ${statusText}

═══════════════════════════
${newState ? '⚠️ This command is now disabled in this group' : '✅ This command is now enabled'}`);
    } catch (err) {
      BotLogger.error(`Failed to toggle command ${cmdName}`, err);
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Failed to toggle command`);
    }
  }
};

export default command;
