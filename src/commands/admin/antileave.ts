import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';

const command: Command = {
  name: 'antileave',
  aliases: ['al', 'noleave'],
  description: 'Toggle anti-leave protection for the group. When enabled, the bot will add back members who leave.',
  category: 'admin',
  usage: 'antileave <on|off|status>',
  examples: ['antileave on', 'antileave off', 'antileave status'],
  adminOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, args, reply } = context;
    const threadId = ('' + event.threadID).trim();
    
    if (!event.isGroup) {
      await reply('⚠️ This command can only be used in group chats.');
      return;
    }

    const action = args[0]?.toLowerCase();
    
    if (!action || !['on', 'off', 'status'].includes(action)) {
      await reply('📋 Usage: N!antileave <on|off|status>\n\n• on - Enable anti-leave protection\n• off - Disable anti-leave protection\n• status - Check current status');
      return;
    }

    const settingKey = `antileave_${threadId}`;

    try {
      if (action === 'status') {
        const isEnabled = await database.getSetting<boolean>(settingKey);
        const status = isEnabled ? '✅ ENABLED' : '❌ DISABLED';
        await reply(`🛡️ Anti-Leave Protection\n\nStatus: ${status}\n\nWhen enabled, users who leave will be automatically added back to the group.`);
        return;
      }

      const enable = action === 'on';
      await database.setSetting(settingKey, enable);

      if (enable) {
        await reply('✅ Anti-Leave Protection ENABLED\n\nMembers who leave this group will be automatically added back.');
      } else {
        await reply('❌ Anti-Leave Protection DISABLED\n\nMembers can now leave the group freely.');
      }
    } catch (error) {
      await reply('❌ Failed to update anti-leave settings. Please try again.');
    }
  }
};

export default command;
