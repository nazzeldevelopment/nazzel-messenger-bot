import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'img2pdf',
  aliases: ['imagetopdf', 'topdf', 'imgtopdf'],
  description: 'Convert image(s) to PDF',
  category: 'utility',
  usage: 'img2pdf (reply to image)',
  examples: ['img2pdf'],
  cooldown: 15000,

  async execute(context: CommandContext): Promise<void> {
    const { reply, prefix } = context;

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     📄 𝗜𝗠𝗔𝗚𝗘 𝗧𝗢 𝗣𝗗𝗙 📄     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 𝗛𝗼𝘄 𝘁𝗼 𝗨𝘀𝗲:
Reply to image(s) with ${prefix}img2pdf

┌────────────────────────┐
│ 📷 Input: Image file(s)
│ 📄 Output: PDF
│ 📊 Quality: High
└────────────────────────┘

✅ 𝗦𝘂𝗽𝗽𝗼𝗿𝘁𝗲𝗱:
• PNG, JPG, JPEG
• Multiple images = Multi-page PDF

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 PDF Tools`);
  }
};

export default command;
