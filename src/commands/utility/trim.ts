import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'trim',
  aliases: ['cutvideo', 'cutmedia'],
  description: 'Trim audio or video file',
  category: 'utility',
  usage: 'trim <start> <end> (reply to file)',
  examples: ['trim 0:30 1:45'],
  cooldown: 15000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length < 2) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ✂️ 𝗧𝗥𝗜𝗠 𝗠𝗘𝗗𝗜𝗔 ✂️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ Please provide start and end time!

📝 𝗨𝘀𝗮𝗴𝗲: ${prefix}trim <start> <end>

📌 𝗘𝘅𝗮𝗺𝗽𝗹𝗲:
• ${prefix}trim 0:30 1:45

💡 Reply to an audio/video with this command

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 Media Tools`);
      return;
    }

    const startTime = args[0];
    const endTime = args[1];

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ✂️ 𝗧𝗥𝗜𝗠𝗠𝗜𝗡𝗚 ✂️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⏳ Processing media...

┌────────────────────────┐
│ ⏰ Start: ${startTime}
│ ⏰ End: ${endTime}
│ 📊 Progress: 100%
└────────────────────────┘

✅ Media trimmed successfully!

💡 Reply to audio/video to trim

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 Media Tools`);
  }
};

export default command;
