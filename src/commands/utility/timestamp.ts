import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'timestamp',
  aliases: ['ts', 'unix', 'epoch'],
  description: 'Get current or convert timestamps',
  category: 'utility',
  usage: 'timestamp [date]',
  examples: ['timestamp', 'timestamp 2024-12-25'],
  cooldown: 3000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;

    if (args.length === 0) {
      const now = new Date();
      const unix = Math.floor(now.getTime() / 1000);
      
      await reply(`╭─────────────────╮
│ ⏰ TIMESTAMP
╰─────────────────╯

📅 Date: ${now.toISOString()}
🔢 Unix: ${unix}
📱 Local: ${now.toLocaleString('en-PH', { timeZone: 'Asia/Manila' })}`);
    } else {
      try {
        const date = new Date(args.join(' '));
        if (isNaN(date.getTime())) {
          await reply(`❌ Invalid date format`);
          return;
        }
        const unix = Math.floor(date.getTime() / 1000);
        await reply(`╭─────────────────╮
│ ⏰ CONVERTED
╰─────────────────╯

📅 Input: ${args.join(' ')}
🔢 Unix: ${unix}
📱 ISO: ${date.toISOString()}`);
      } catch {
        await reply(`❌ Invalid date format`);
      }
    }
  }
};

export default command;
