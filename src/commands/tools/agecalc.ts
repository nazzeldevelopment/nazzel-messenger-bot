import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'agecalc',
  aliases: ['myage', 'howold', 'birthdaycalc'],
  description: 'Calculate age from birthdate',
  category: 'tools',
  usage: 'agecalc <YYYY-MM-DD>',
  examples: ['agecalc 2000-01-15', 'agecalc 1995-12-25'],
  cooldown: 3000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length === 0) {
      await reply(`╭─────────────────╮
│ 📅 AGE CALC
╰─────────────────╯

Usage: ${prefix}agecalc YYYY-MM-DD

Example: ${prefix}agecalc 2000-01-15`);
      return;
    }

    const birthDate = new Date(args[0]);
    if (isNaN(birthDate.getTime())) {
      await reply(`❌ Invalid date! Use format: YYYY-MM-DD`);
      return;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    const days = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30.44);

    await reply(`╭─────────────────╮
│ 🎂 YOUR AGE
╰─────────────────╯

🗓️ Born: ${birthDate.toLocaleDateString()}
🎈 Age: ${age} years
📅 Months: ${months.toLocaleString()}
⏰ Days: ${days.toLocaleString()}`);
  }
};

export default command;
