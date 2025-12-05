import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'fileinfo',
  aliases: ['fi', 'filedetails', 'metadata'],
  description: 'Get information about a file',
  category: 'utility',
  usage: 'fileinfo (reply to file)',
  examples: ['fileinfo'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { reply, prefix } = context;

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ℹ️ 𝗙𝗜𝗟𝗘 𝗜𝗡𝗙𝗢 ℹ️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 𝗛𝗼𝘄 𝘁𝗼 𝗨𝘀𝗲:
Reply to any file with ${prefix}fileinfo

┌────────────────────────┐
│ 📁 Name: ---
│ 📊 Size: ---
│ 📋 Type: ---
│ 📅 Date: ---
└────────────────────────┘

✅ 𝗜𝗻𝗳𝗼 𝗣𝗿𝗼𝘃𝗶𝗱𝗲𝗱:
• File name & extension
• File size
• MIME type
• Metadata (if available)

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 File Tools`);
  }
};

export default command;
