import type { Command } from '../../types/index.js';
import { decorations } from '../../lib/messageFormatter.js';

export const command: Command = {
  name: 'invite',
  aliases: ['addbot', 'getbot', 'botlink', 'botinvite'],
  description: 'Get information on how to add the bot to your group',
  category: 'general',
  usage: 'invite',
  examples: ['invite'],
  cooldown: 10000,

  async execute({ api, config, reply }) {
    const botId = api.getCurrentUserID?.() || 'Bot ID';
    const botName = config.bot.name || 'Nazzel Bot';
    const prefix = config.bot.prefix || 'N!';

    await reply(`${decorations.rocket} 『 INVITE BOT 』 ${decorations.rocket}
━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.sparkle} Add ${botName} to your group!

◈ STEP 1 - Add Friend
━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 fb.com/${botId}
📱 Click "Add Friend" and wait

◈ STEP 2 - Add to Group
━━━━━━━━━━━━━━━━━━━━━━━━━
💬 Open your Messenger group
👥 Click "Add People"
✅ Select the bot

◈ STEP 3 - Make Admin
━━━━━━━━━━━━━━━━━━━━━━━━━
👑 For full features, make
   the bot a group admin

◈ STEP 4 - Start Using!
━━━━━━━━━━━━━━━━━━━━━━━━━
⌨️ Type: ${prefix}help

◈ BOT INFO
━━━━━━━━━━━━━━━━━━━━━━━━━
🤖 Name: ${botName}
🆔 ID: ${botId}
🔧 Prefix: ${prefix}
📦 Version: ${config.bot.version}

━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Bot must accept friend request
   before being added to groups`);
  },
};

export default command;
