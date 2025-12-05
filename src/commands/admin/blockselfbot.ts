import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';

const command: Command = {
  name: 'blockselfbot',
  aliases: ['antiselfbot', 'selfbotblock', 'noselfbot'],
  description: 'Block self-bot/automated accounts',
  category: 'admin',
  usage: 'blockselfbot <on/off>',
  examples: ['blockselfbot on', 'blockselfbot off'],
  cooldown: 5000,
  adminOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, event, prefix } = context;
    const threadId = event.threadID;

    if (args.length === 0) {
      const current = await database.getSetting<boolean>(`blockselfbot_${threadId}`) || false;
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🤖 𝗕𝗟𝗢𝗖𝗞 𝗦𝗘𝗟𝗙𝗕𝗢𝗧 🤖     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📊 𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗦𝘁𝗮𝘁𝘂𝘀: ${current ? '🟢 ON' : '🔴 OFF'}

📝 𝗨𝘀𝗮𝗴𝗲:
• ${prefix}blockselfbot on
• ${prefix}blockselfbot off

💡 When enabled:
• Detects self-bot patterns
• Blocks automated accounts
• Prevents bot spam

━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ Security Settings`);
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
    await database.setSetting(`blockselfbot_${threadId}`, enabled);

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🤖 𝗕𝗟𝗢𝗖𝗞 𝗦𝗘𝗟𝗙𝗕𝗢𝗧 🤖     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${enabled ? '✅' : '❌'} Self-bot blocker ${enabled ? 'enabled' : 'disabled'}!

┌────────────────────────┐
│ 🤖 Status: ${enabled ? 'ACTIVE' : 'INACTIVE'}
│ 🔍 Detection: ${enabled ? 'Enabled' : 'Disabled'}
│ 🚫 Auto-block: ${enabled ? 'Yes' : 'No'}
└────────────────────────┘

${enabled ? '💡 Self-bots will be blocked' : '💡 Self-bot blocker is now off'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ Security Settings`);
  }
};

export default command;
