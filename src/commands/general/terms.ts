import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'terms',
  aliases: ['tos', 'termsofservice'],
  description: 'View terms of service',
  category: 'general',
  usage: 'terms',
  examples: ['terms'],
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;

    await reply(`╭─────────────────╮
│ 📜 TERMS
╰─────────────────╯

By using this bot, you agree to:

✅ Allowed:
• Use commands normally
• Have fun with features
• Report bugs & issues

❌ Not Allowed:
• Spam or abuse commands
• Exploit bugs/glitches
• Harass other users
• Use for illegal purposes

⚠️ Violations may result in:
• Temporary mute
• Permanent ban
• Data deletion

We reserve the right to modify these terms at any time.`);
  }
};

export default command;
