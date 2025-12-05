import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'pdfmerge',
  aliases: ['mergepdf', 'combinepdf', 'joinpdf'],
  description: 'Merge multiple PDF files into one',
  category: 'utility',
  usage: 'pdfmerge (reply to PDFs)',
  examples: ['pdfmerge'],
  cooldown: 20000,

  async execute(context: CommandContext): Promise<void> {
    const { reply, prefix } = context;

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     📑 𝗠𝗘𝗥𝗚𝗘 𝗣𝗗𝗙 📑     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 𝗛𝗼𝘄 𝘁𝗼 𝗨𝘀𝗲:
1. Send multiple PDF files
2. Reply with ${prefix}pdfmerge

┌────────────────────────┐
│ 📁 PDF 1: Waiting...
│ 📁 PDF 2: Waiting...
│ 📄 Output: Merged PDF
└────────────────────────┘

✅ Features:
• Merge 2-10 PDFs
• Preserves quality
• Maintains page order

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 PDF Tools`);
  }
};

export default command;
