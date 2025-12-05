import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'notedelete',
  aliases: ['delnote', 'removenote', 'deletenote'],
  description: 'Delete a note by ID',
  category: 'utility',
  usage: 'notedelete <id>',
  examples: ['notedelete 1'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length === 0) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🗑️ 𝗗𝗘𝗟𝗘𝗧𝗘 𝗡𝗢𝗧𝗘 🗑️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ Please provide note ID!

📝 𝗨𝘀𝗮𝗴𝗲: ${prefix}notedelete <id>

📌 𝗘𝘅𝗮𝗺𝗽𝗹𝗲:
• ${prefix}notedelete 1

💡 Use ${prefix}notelist to see IDs

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Notes System`);
      return;
    }

    const id = args[0];

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🗑️ 𝗡𝗢𝗧𝗘 𝗗𝗘𝗟𝗘𝗧𝗘𝗗 🗑️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ Note #${id} deleted!

💡 Use ${prefix}notelist to view remaining

━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Notes System`);
  }
};

export default command;
