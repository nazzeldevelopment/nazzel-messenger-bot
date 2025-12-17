import type { Command, CommandContext } from '../../types/index.js';
import config from '../../../config.json' with { type: 'json' };

const command: Command = {
  name: 'credits',
  aliases: ['credit', 'thanks', 'devs'],
  description: 'View credits and contributors',
  category: 'general',
  usage: 'credits',
  examples: ['credits'],
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;

    await reply(`╭─────────────────╮
│ 🏆 CREDITS
╰─────────────────╯

👨‍💻 Developer: Nazzel Team
📦 Bot: ${config.bot.name}
🔖 Version: ${config.bot.version}

📚 Libraries Used:
• sulyap-fca (Messenger API)
• MongoDB (Database)
• Redis (Caching)
• OpenAI (AI Features)
• FFmpeg (Audio Processing)

💝 Special Thanks:
• All beta testers
• Community contributors
• You for using this bot!`);
  }
};

export default command;
