import type { Command } from '../../types/index.js';
import config from '../../../config.json' with { type: 'json' };

export const command: Command = {
  name: 'botinfo',
  aliases: ['bot', 'bi'],
  description: 'Show bot information',
  category: 'general',
  usage: 'botinfo',
  examples: ['botinfo'],
  cooldown: 5000,
  async execute({ reply }) {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    
    await reply(`🤖 BOT INFO\n\n📛 ${config.bot.name}\n📌 v${config.bot.version}\n⏰ Uptime: ${hours}h ${minutes}m\n🔧 Prefix: ${config.bot.prefix}\n💻 Node.js ${process.version}`);
  },
};
