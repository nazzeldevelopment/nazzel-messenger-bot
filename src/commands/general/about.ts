import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'about',
  aliases: ['botinfo', 'credits', 'dev'],
  description: 'Show information about the bot',
  category: 'general',
  usage: 'about',
  examples: ['about'],
  cooldown: 5,

  async execute({ config, reply }) {
    const message = `
🤖 *${config.bot.name}*

📋 *About:*
${config.bot.description}

📦 *Version:* ${config.bot.version}
🔧 *Prefix:* ${config.bot.prefix}
💻 *Platform:* Facebook Messenger
🌐 *API:* ws3-fca

📊 *Features:*
• Modular command system
• XP & Leveling system
• Music player
• Admin controls
• Redis caching
• PostgreSQL database

👨‍💻 *Developer:* Nazzel
📅 *Created:* 2024

💡 Use ${config.bot.prefix}help to see all commands!
    `.trim();

    await reply(message);
  },
};
