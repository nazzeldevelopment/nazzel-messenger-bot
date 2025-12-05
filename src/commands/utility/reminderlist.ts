import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'reminderlist',
  aliases: ['reminders', 'myreminders', 'listreminders'],
  description: 'View your active reminders',
  category: 'utility',
  usage: 'reminderlist',
  examples: ['reminderlist'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { reply, prefix } = context;

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     📋 𝗠𝗬 𝗥𝗘𝗠𝗜𝗡𝗗𝗘𝗥𝗦 📋     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📋 𝗔𝗰𝘁𝗶𝘃𝗲 𝗥𝗲𝗺𝗶𝗻𝗱𝗲𝗿𝘀:
┌────────────────────────┐
│ 📭 No active reminders
│ 
│ Set one with:
│ ${prefix}remindme <time> <msg>
└────────────────────────┘

💡 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀:
• ${prefix}remindme - Create new
• ${prefix}reminderdelete <id> - Delete

━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Reminder System`);
  }
};

export default command;
