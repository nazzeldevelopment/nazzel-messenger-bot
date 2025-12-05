import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'notelist',
  aliases: ['notes', 'mynotes', 'listnotes'],
  description: 'View all your saved notes',
  category: 'utility',
  usage: 'notelist',
  examples: ['notelist'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { reply, prefix } = context;

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     📋 𝗠𝗬 𝗡𝗢𝗧𝗘𝗦 📋     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📋 𝗦𝗮𝘃𝗲𝗱 𝗡𝗼𝘁𝗲𝘀:
┌────────────────────────┐
│ 📭 No notes saved
│ 
│ Add one with:
│ ${prefix}noteadd <text>
└────────────────────────┘

💡 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀:
• ${prefix}noteadd - Add new note
• ${prefix}notedelete <id> - Delete note

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Notes System`);
  }
};

export default command;
