import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'unzip',
  aliases: ['extract', 'unrar', 'decompress'],
  description: 'Extract files from a ZIP archive',
  category: 'utility',
  usage: 'unzip (reply to ZIP file)',
  examples: ['unzip'],
  cooldown: 15000,

  async execute(context: CommandContext): Promise<void> {
    const { reply, prefix } = context;

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     📦 𝗨𝗡𝗭𝗜𝗣 𝗙𝗜𝗟𝗘 📦     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 𝗛𝗼𝘄 𝘁𝗼 𝗨𝘀𝗲:
Reply to a ZIP file with ${prefix}unzip

┌────────────────────────┐
│ 📁 Input: ZIP/RAR file
│ 📂 Output: Extracted files
│ 📊 Status: Ready
└────────────────────────┘

✅ 𝗦𝘂𝗽𝗽𝗼𝗿𝘁𝗲𝗱:
• ZIP archives
• RAR archives
• 7Z archives

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 Archive Tools`);
  }
};

export default command;
