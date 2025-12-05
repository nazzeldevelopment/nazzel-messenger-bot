import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';

const command: Command = {
  name: 'autoremove',
  aliases: ['autokick', 'joinspammer', 'removejoinspam'],
  description: 'Auto-remove join spammers',
  category: 'admin',
  usage: 'autoremove <on/off>',
  examples: ['autoremove on', 'autoremove off'],
  cooldown: 5000,
  adminOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, event, prefix } = context;
    const threadId = event.threadID;

    if (args.length === 0) {
      const current = await database.getSetting<boolean>(`autoremove_${threadId}`) || false;
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🚫 𝗔𝗨𝗧𝗢 𝗥𝗘𝗠𝗢𝗩𝗘 🚫     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📊 𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗦𝘁𝗮𝘁𝘂𝘀: ${current ? '🟢 ON' : '🔴 OFF'}

📝 𝗨𝘀𝗮𝗴𝗲:
• ${prefix}autoremove on
• ${prefix}autoremove off

💡 When enabled:
• Detects join spammers
• Auto-removes suspicious accounts
• Blocks repeated join attempts

━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ Moderation Settings`);
      return;
    }

    const mode = args[0].toLowerCase();
    
    if (mode !== 'on' && mode !== 'off') {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ❌ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 ❌     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ Please use 'on' or 'off'

━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      return;
    }

    const enabled = mode === 'on';
    await database.setSetting(`autoremove_${threadId}`, enabled);

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🚫 𝗔𝗨𝗧𝗢 𝗥𝗘𝗠𝗢𝗩𝗘 🚫     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${enabled ? '✅' : '❌'} Auto-remove ${enabled ? 'enabled' : 'disabled'}!

┌────────────────────────┐
│ 🚫 Status: ${enabled ? 'ACTIVE' : 'INACTIVE'}
│ 🔍 Detection: ${enabled ? 'Enabled' : 'Disabled'}
│ 🔒 Auto-kick: ${enabled ? 'Yes' : 'No'}
└────────────────────────┘

${enabled ? '💡 Join spammers will be auto-removed' : '💡 Auto-remove is now off'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ Moderation Settings`);
  }
};

export default command;
