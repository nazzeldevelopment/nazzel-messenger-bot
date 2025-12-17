import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'support',
  aliases: ['helpme', 'contact', 'assist'],
  description: 'Get support and help links',
  category: 'general',
  usage: 'support',
  examples: ['support'],
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { reply, prefix } = context;

    await reply(`╭─────────────────╮
│ 🆘 SUPPORT
╰─────────────────╯

Need help? Here's how to get support:

📖 Commands:
• ${prefix}help - View all commands
• ${prefix}faq - Common questions
• ${prefix}report - Report issues

💬 Contact:
• Use ${prefix}owner for owner info
• DM the bot owner directly

⚡ Quick Tips:
• Check ${prefix}faq first
• Include error details in reports
• Be patient for responses`);
  }
};

export default command;
