import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'invite',
  aliases: ['addbot', 'getbot', 'botlink'],
  description: 'Get information on how to add the bot',
  category: 'general',
  usage: 'invite',
  examples: ['invite'],
  cooldown: 10,

  async execute({ api, config, reply }) {
    const botId = api.getCurrentUserID?.() || 'Bot ID';

    let message = `🤖 *Invite ${config.bot.name}*\n\n`;
    message += `To add the bot to your group:\n\n`;
    message += `1️⃣ Add this account as friend:\n`;
    message += `   facebook.com/${botId}\n\n`;
    message += `2️⃣ Add the bot to your group chat\n\n`;
    message += `3️⃣ Make the bot an admin (optional but recommended)\n\n`;
    message += `4️⃣ Start using commands with prefix: ${config.bot.prefix}\n\n`;
    message += `📋 Example: ${config.bot.prefix}help\n\n`;
    message += `⚠️ Note: The bot needs to accept your friend request first.`;

    await reply(message);
  },
};
