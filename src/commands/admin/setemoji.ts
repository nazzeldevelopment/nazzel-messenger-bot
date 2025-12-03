import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'setemoji',
  aliases: ['emoji', 'seticon', 'groupemoji'],
  description: 'Change the group chat emoji',
  category: 'admin',
  usage: 'setemoji <emoji>',
  examples: ['setemoji 🔥', 'setemoji 💯', 'setemoji 🎮'],
  cooldown: 30,
  adminOnly: true,

  async execute({ api, event, args, reply }) {
    if (!event.isGroup) {
      await reply('❌ This command can only be used in group chats.');
      return;
    }

    if (!args[0]) {
      await reply('❌ Please provide an emoji.\n\nUsage: setemoji <emoji>\n\nExample: setemoji 🔥');
      return;
    }

    const emoji = args[0];

    try {
      const threadId = ('' + event.threadID).trim();
      if (api.changeThreadEmoji) {
        await api.changeThreadEmoji(emoji, threadId);
      } else {
        await api.changeThreadColor(emoji, threadId);
      }

      await reply(`✅ *Group Emoji Changed*\n\n🎨 New emoji: ${emoji}`);
    } catch (error) {
      await reply('❌ Failed to change emoji. Make sure you provided a valid emoji and the bot has permission.');
    }
  },
};
