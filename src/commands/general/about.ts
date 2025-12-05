import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'about',
  aliases: ['botinfo', 'credits', 'dev'],
  description: 'Show information about the bot',
  category: 'general',
  usage: 'about',
  examples: ['about'],
  cooldown: 5000,

  async execute({ config, reply, prefix }) {
    const timestamp = new Date().toLocaleString('en-PH', {
      timeZone: 'Asia/Manila',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    await reply(`╭─────────────────╮
│ 👑 ${config.bot.name.toUpperCase()}
╰─────────────────╯

✨ ${config.bot.description}

📦 BOT DETAILS
🏷️ Version: ${config.bot.version}
🔧 Prefix: ${prefix}
💻 Platform: Messenger
🗄️ Database: MongoDB

🎮 FEATURES
📊 203+ Commands
🏆 XP & Leveling System
💰 Economy System
🎵 Music Player
🛡️ Admin Controls
⚡ Redis Caching
🔐 Bad Words Filter
🎉 Welcome Messages

💝 CREDITS
👨‍💻 Developer: Nazzel
📅 Created: 2025
💖 Made with love

⏰ ${timestamp}

💡 Type ${prefix}help to explore!

╭─────────────────╮
│ 💗 Wisdom Bot
╰─────────────────╯`);
  },
};
