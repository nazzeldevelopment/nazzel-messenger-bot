import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'privacy',
  aliases: ['privacypolicy', 'data'],
  description: 'View privacy policy and data info',
  category: 'general',
  usage: 'privacy',
  examples: ['privacy'],
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { reply, prefix } = context;

    await reply(`╭─────────────────╮
│ 🔒 PRIVACY
╰─────────────────╯

📊 Data We Collect:
• User ID (for features)
• Message count (for XP)
• Coin balances
• Command usage stats

🛡️ Data Protection:
• Data is encrypted
• No personal messages stored
• No selling of data

🗑️ Delete Your Data:
• Use ${prefix}resetuserdata
• Contact owner for full deletion

❓ Questions?
Use ${prefix}support`);
  }
};

export default command;
