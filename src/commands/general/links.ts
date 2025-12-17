import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'links',
  aliases: ['link', 'urls', 'socials'],
  description: 'Get important links and resources',
  category: 'general',
  usage: 'links',
  examples: ['links'],
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;

    await reply(`╭─────────────────╮
│ 🔗 LINKS
╰─────────────────╯

📱 Official Links:
• Website: nazzel.dev
• Support: Contact owner

📖 Resources:
• Documentation: Coming soon
• Changelog: Use N!changelog

💝 Support Us:
• Use N!donate for info`);
  }
};

export default command;
