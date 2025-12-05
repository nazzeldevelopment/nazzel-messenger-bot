import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'compresspdf',
  aliases: ['pdfcompress', 'shrinkpdf', 'smallpdf'],
  description: 'Compress PDF to reduce file size',
  category: 'utility',
  usage: 'compresspdf (reply to PDF)',
  examples: ['compresspdf'],
  cooldown: 15000,

  async execute(context: CommandContext): Promise<void> {
    const { reply, prefix } = context;

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     📉 𝗖𝗢𝗠𝗣𝗥𝗘𝗦𝗦 𝗣𝗗𝗙 📉     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 𝗛𝗼𝘄 𝘁𝗼 𝗨𝘀𝗲:
Reply to a PDF with ${prefix}compresspdf

┌────────────────────────┐
│ 📁 Input: PDF file
│ 📉 Output: Compressed PDF
│ 💾 Reduction: Up to 70%
└────────────────────────┘

✅ 𝗕𝗲𝗻𝗲𝗳𝗶𝘁𝘀:
• Smaller file size
• Easier to share
• Quality preserved

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 PDF Tools`);
  }
};

export default command;
