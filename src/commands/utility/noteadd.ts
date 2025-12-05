import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'noteadd',
  aliases: ['addnote', 'newnote', 'savenote'],
  description: 'Add a new note',
  category: 'utility',
  usage: 'noteadd <text>',
  examples: ['noteadd Remember to buy milk'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length === 0) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     📝 𝗔𝗗𝗗 𝗡𝗢𝗧𝗘 📝     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ Please provide note text!

📝 𝗨𝘀𝗮𝗴𝗲: ${prefix}noteadd <text>

📌 𝗘𝘅𝗮𝗺𝗽𝗹𝗲:
• ${prefix}noteadd Buy groceries
• ${prefix}noteadd Meeting at 3pm

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Notes System`);
      return;
    }

    const noteText = args.join(' ');

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     📝 𝗡𝗢𝗧𝗘 𝗦𝗔𝗩𝗘𝗗 📝     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ Note added successfully!

┌────────────────────────┐
│ 📝 ${noteText.substring(0, 25)}${noteText.length > 25 ? '...' : ''}
│ 🆔 ID: 1
│ 📅 Date: ${new Date().toLocaleDateString()}
└────────────────────────┘

💡 Use ${prefix}notelist to view all notes

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Notes System`);
  }
};

export default command;
