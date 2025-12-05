import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';
import { decorations } from '../../lib/messageFormatter.js';
import { commandHandler } from '../../lib/commandHandler.js';

const command: Command = {
  name: 'reload',
  aliases: ['reloadcmd', 'refresh'],
  description: 'Reload a specific command or all commands',
  category: 'admin',
  usage: 'reload [command|all]',
  examples: ['reload help', 'reload all', 'reload'],
  ownerOnly: true,
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;
    
    const target = args[0]?.toLowerCase() || 'all';
    
    try {
      if (target === 'all') {
        await commandHandler.reloadCommands();
        
        const totalCommands = commandHandler.getAllCommands().size;
        
        BotLogger.info('Reloaded all commands');
        
        await reply(`🔄 『 COMMANDS RELOADED 』 🔄
═══════════════════════════
${decorations.fire} Full Reload Complete
═══════════════════════════

◈ STATUS
═══════════════════════════
✅ Reloaded: All commands
📊 Total: ${totalCommands} commands

═══════════════════════════
${decorations.sparkle} All commands refreshed!`);
      } else {
        const cmd = commandHandler.getCommand(target);
        if (!cmd) {
          await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Command "${target}" not found
💡 Use ${prefix}reload all to reload all`);
          return;
        }
        
        await commandHandler.reloadCommands();
        
        BotLogger.info(`Reloaded command: ${cmd.name}`);
        
        await reply(`🔄 『 COMMAND RELOADED 』 🔄
═══════════════════════════
${decorations.fire} Reload Complete
═══════════════════════════

◈ COMMAND
═══════════════════════════
📝 Name: ${prefix}${cmd.name}
📁 Category: ${cmd.category}
✅ Status: Reloaded

═══════════════════════════
${decorations.sparkle} Command refreshed!`);
      }
    } catch (err) {
      BotLogger.error('Failed to reload commands', err);
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Failed to reload commands`);
    }
  }
};

export default command;
