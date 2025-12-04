import type { Command } from '../../types/index.js';
import { decorations } from '../../lib/messageFormatter.js';

export const command: Command = {
  name: 'about',
  aliases: ['botinfo', 'credits', 'dev'],
  description: 'Show information about the bot',
  category: 'general',
  usage: 'about',
  examples: ['about'],
  cooldown: 5000,

  async execute({ config, reply }) {
    await reply(`${decorations.crown} 『 ${config.bot.name.toUpperCase()} 』 ${decorations.crown}
━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.sparkle} ${config.bot.description}

◈ BOT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━
📦 Version: ${config.bot.version}
🔧 Prefix: ${config.bot.prefix}
💻 Platform: Messenger
🌐 API: @dongdev/fca-unofficial

◈ FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━
🎮 100+ Commands
📊 XP & Leveling System
🎵 Music Player
🛡️ Admin Controls
⚡ Redis Caching
🗄️ MongoDB Database
🔐 Bad Words Filter
🎉 Welcome Messages

◈ CREDITS
━━━━━━━━━━━━━━━━━━━━━━━━━
👨‍💻 Developer: Nazzel
📅 Created: 2024
${decorations.heart} Made with love

━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Type ${config.bot.prefix}help to explore!`);
  },
};
