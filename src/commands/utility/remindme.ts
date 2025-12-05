import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'remindme',
  aliases: ['rm', 'setreminder', 'alarm'],
  description: 'Set a reminder for yourself',
  category: 'utility',
  usage: 'remindme <time> <message>',
  examples: ['remindme 30m Take a break', 'remindme 2h Meeting'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length < 2) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ⏰ 𝗥𝗘𝗠𝗜𝗡𝗗 𝗠𝗘 ⏰     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ Please provide time and message!

📝 𝗨𝘀𝗮𝗴𝗲: ${prefix}remindme <time> <message>

⏱️ 𝗧𝗶𝗺𝗲 𝗙𝗼𝗿𝗺𝗮𝘁𝘀:
• 30s = 30 seconds
• 5m = 5 minutes
• 2h = 2 hours
• 1d = 1 day

📌 𝗘𝘅𝗮𝗺𝗽𝗹𝗲𝘀:
• ${prefix}remindme 30m Take medicine
• ${prefix}remindme 2h Call mom

━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Reminder System`);
      return;
    }

    const timeStr = args[0].toLowerCase();
    const message = args.slice(1).join(' ');

    const timeMatch = timeStr.match(/^(\d+)(s|m|h|d)$/);
    if (!timeMatch) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ❌ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗧𝗜𝗠𝗘 ❌     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ Invalid time format!

✅ Use: 30s, 5m, 2h, 1d

━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      return;
    }

    const amount = parseInt(timeMatch[1]);
    const unit = timeMatch[2];
    let unitName = 'seconds';
    if (unit === 'm') unitName = 'minutes';
    if (unit === 'h') unitName = 'hours';
    if (unit === 'd') unitName = 'days';

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ⏰ 𝗥𝗘𝗠𝗜𝗡𝗗𝗘𝗥 𝗦𝗘𝗧 ⏰     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ Reminder created!

┌────────────────────────┐
│ ⏱️ Time: ${amount} ${unitName}
│ 📝 Message: ${message.substring(0, 20)}${message.length > 20 ? '...' : ''}
│ 🔔 Status: Active
└────────────────────────┘

💡 I'll remind you when it's time!

━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ Reminder System`);
  }
};

export default command;
