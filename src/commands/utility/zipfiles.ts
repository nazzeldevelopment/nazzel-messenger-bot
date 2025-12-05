import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'zipfiles',
  aliases: ['zip', 'compress', 'archive'],
  description: 'Create a ZIP archive from files',
  category: 'utility',
  usage: 'zipfiles (reply to files)',
  examples: ['zipfiles'],
  cooldown: 15000,

  async execute(context: CommandContext): Promise<void> {
    const { reply, prefix } = context;

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     📦 𝗭𝗜𝗣 𝗙𝗜𝗟𝗘𝗦 📦     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 𝗛𝗼𝘄 𝘁𝗼 𝗨𝘀𝗲:
1. Send multiple files
2. Reply with ${prefix}zipfiles

┌────────────────────────┐
│ 📁 Files: Waiting...
│ 📦 Output: archive.zip
│ 📊 Compression: High
└────────────────────────┘

✅ 𝗙𝗲𝗮𝘁𝘂𝗿𝗲𝘀:
• Compress multiple files
• Reduce total size
• Easy sharing

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 Archive Tools`);
  }
};

export default command;
