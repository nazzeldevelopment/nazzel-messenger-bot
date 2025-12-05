import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'extractaudio',
  aliases: ['getaudio', 'video2audio', 'v2a'],
  description: 'Extract audio from a video file',
  category: 'utility',
  usage: 'extractaudio (reply to video)',
  examples: ['extractaudio'],
  cooldown: 15000,

  async execute(context: CommandContext): Promise<void> {
    const { reply, prefix } = context;

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🎵 𝗘𝗫𝗧𝗥𝗔𝗖𝗧 𝗔𝗨𝗗𝗜𝗢 🎵     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 𝗛𝗼𝘄 𝘁𝗼 𝗨𝘀𝗲:
Reply to a video with ${prefix}extractaudio

┌────────────────────────┐
│ 🎬 Input: Video file
│ 🎵 Output: MP3 audio
│ 📊 Quality: 320kbps
└────────────────────────┘

✅ 𝗦𝘂𝗽𝗽𝗼𝗿𝘁𝗲𝗱 𝗙𝗼𝗿𝗺𝗮𝘁𝘀:
• MP4, AVI, MKV, MOV
• WebM, FLV, WMV

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 Video Tools`);
  }
};

export default command;
