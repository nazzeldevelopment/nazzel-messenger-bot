import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'merge',
  aliases: ['combine', 'join', 'mergemedia'],
  description: 'Merge two files together',
  category: 'utility',
  usage: 'merge (reply to files)',
  examples: ['merge'],
  cooldown: 20000,

  async execute(context: CommandContext): Promise<void> {
    const { reply, prefix } = context;

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🔗 𝗠𝗘𝗥𝗚𝗘 𝗙𝗜𝗟𝗘𝗦 🔗     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 𝗛𝗼𝘄 𝘁𝗼 𝗨𝘀𝗲:
1. Send two files
2. Reply with ${prefix}merge

┌────────────────────────┐
│ 📁 File 1: Waiting...
│ 📁 File 2: Waiting...
│ 📊 Status: Ready
└────────────────────────┘

✅ 𝗦𝘂𝗽𝗽𝗼𝗿𝘁𝗲𝗱:
• Audio files (MP3, WAV)
• Video files (MP4, MKV)
• PDF documents

━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 File Tools`);
  }
};

export default command;
