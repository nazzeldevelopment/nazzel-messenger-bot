import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'extracttext',
  aliases: ['ocr', 'readtext', 'gettext', 'imagetotext'],
  description: 'Extract text from image or PDF (OCR)',
  category: 'utility',
  usage: 'extracttext (reply to image/PDF)',
  examples: ['extracttext'],
  cooldown: 15000,

  async execute(context: CommandContext): Promise<void> {
    const { reply, prefix } = context;

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     📝 𝗘𝗫𝗧𝗥𝗔𝗖𝗧 𝗧𝗘𝗫𝗧 📝     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 𝗛𝗼𝘄 𝘁𝗼 𝗨𝘀𝗲:
Reply to an image/PDF with ${prefix}extracttext

┌────────────────────────┐
│ 📷 Input: Image/PDF
│ 📝 Output: Text
│ 🔍 OCR: Enabled
└────────────────────────┘

✅ 𝗦𝘂𝗽𝗽𝗼𝗿𝘁𝗲𝗱:
• Images (PNG, JPG, GIF)
• PDF documents
• Screenshots

💡 Best results with clear text

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 OCR Tools`);
  }
};

export default command;
