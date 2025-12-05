import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'setname',
  aliases: ['groupname', 'rename', 'title'],
  description: 'Change the group chat name',
  category: 'admin',
  usage: 'setname <new name>',
  examples: ['setname Cool Group Chat', 'setname Wisdom Bot Users'],
  cooldown: 30,
  adminOnly: true,

  async execute({ api, event, args, reply }) {
    if (!event.isGroup) {
      await reply('❌ This command can only be used in group chats.');
      return;
    }

    if (!args.length) {
      await reply('❌ Please provide a new name.\n\nUsage: setname <new name>');
      return;
    }

    const newName = args.join(' ');

    if (newName.length > 250) {
      await reply('❌ Group name is too long! Maximum 250 characters.');
      return;
    }

    try {
      const threadId = ('' + event.threadID).trim();
      await api.setTitle(newName, threadId);

      await reply(`✅ *Group Name Changed*\n\n📝 New name: ${newName}`);
    } catch (error) {
      await reply('❌ Failed to change group name. Make sure the bot has permission.');
    }
  },
};
