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
    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  👑 ${config.bot.name.toUpperCase()} 👑  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✨ ${config.bot.description}

┌── 📦 𝗕𝗢𝗧 𝗗𝗘𝗧𝗔𝗜𝗟𝗦 ──┐
│ 🏷️ Version: ${config.bot.version}
│ 🔧 Prefix: ${prefix}
│ 💻 Platform: Messenger
│ 🌐 API: Nazzel Official Website
│ 🗄️ Database: MongoDB
└─────────────────────────────┘

┌── 🎮 𝗙𝗘𝗔𝗧𝗨𝗥𝗘𝗦 ──┐
│ 📊 129+ Commands
│ 🏆 XP & Leveling System
│ 💰 Economy System
│ 🎵 Music Player
│ 🛡️ Admin Controls
│ ⚡ Redis Caching
│ 🔐 Bad Words Filter
│ 🎉 Welcome Messages
└────────────────────┘

┌── 💝 𝗖𝗥𝗘𝗗𝗜𝗧𝗦 ──┐
│ 👨‍💻 Developer: Nazzel
│ 🌐 Website: nazzel.dev
│ 📅 Created: 2025
│ 💖 Made with love
└────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Type ${prefix}help to explore!`);
  },
};
