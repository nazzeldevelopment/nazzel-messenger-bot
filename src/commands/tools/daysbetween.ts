import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'daysbetween',
  aliases: ['datediff', 'daysdiff', 'between'],
  description: 'Calculate days between two dates',
  category: 'tools',
  usage: 'daysbetween <date1> <date2>',
  examples: ['daysbetween 2024-01-01 2024-12-31'],
  cooldown: 3000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length < 2) {
      await reply(`╭─────────────────╮
│ 📆 DAYS BETWEEN
╰─────────────────╯

Usage: ${prefix}daysbetween <date1> <date2>

Example: ${prefix}daysbetween 2024-01-01 2024-12-31`);
      return;
    }

    const date1 = new Date(args[0]);
    const date2 = new Date(args[1]);

    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
      await reply(`❌ Invalid date! Use format: YYYY-MM-DD`);
      return;
    }

    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30.44);

    await reply(`╭─────────────────╮
│ 📊 DATE DIFF
╰─────────────────╯

📅 From: ${date1.toLocaleDateString()}
📅 To: ${date2.toLocaleDateString()}

⏰ Days: ${diffDays.toLocaleString()}
📆 Weeks: ${diffWeeks.toLocaleString()}
🗓️ Months: ~${diffMonths.toLocaleString()}`);
  }
};

export default command;
