import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'reminderdelete',
  aliases: ['delreminder', 'removereminder', 'cancelreminder'],
  description: 'Delete a reminder by ID',
  category: 'utility',
  usage: 'reminderdelete <id>',
  examples: ['reminderdelete 1'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length === 0) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🗑️ 𝗗𝗘𝗟𝗘𝗧𝗘 𝗥𝗘𝗠𝗜𝗡𝗗𝗘𝗥 🗑️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ Please provide reminder ID!

📝 𝗨𝘀𝗮𝗴𝗲: ${prefix}reminderdelete <id>

📌 𝗘𝘅𝗮𝗺𝗽𝗹𝗲:
• ${prefix}reminderdelete 1

💡 Use ${prefix}reminderlist to see IDs

━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Reminder System`);
      return;
    }

    const id = args[0];

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🗑️ 𝗥𝗘𝗠𝗜𝗡𝗗𝗘𝗥 𝗗𝗘𝗟𝗘𝗧𝗘𝗗 🗑️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ Reminder #${id} deleted!

💡 Use ${prefix}reminderlist to view remaining

━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Reminder System`);
  }
};

export default command;
