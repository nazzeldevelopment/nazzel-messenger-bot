import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'memberlist',
  aliases: ['members', 'listmembers', 'groupmembers'],
  description: 'List all members in the group',
  category: 'utility',
  usage: 'memberlist',
  examples: ['memberlist'],
  cooldown: 30,

  async execute({ api, event, reply }) {
    if (!event.isGroup) {
      await reply('❌ This command can only be used in group chats.');
      return;
    }

    try {
      const threadId = ('' + event.threadID).trim();
      const threadInfo = await api.getThreadInfo(threadId);

      const participantIDs = threadInfo.participantIDs || [];
      
      if (participantIDs.length === 0) {
        await reply('❌ Could not get member list.');
        return;
      }

      const userInfo = await api.getUserInfo(participantIDs);

      const adminIDs = (threadInfo.adminIDs || []).map((a: any) => a.id || a);

      let message = `👥 *Group Members*\n\n`;
      message += `📊 Total: ${participantIDs.length} members\n\n`;

      const members = participantIDs.map((id: string) => {
        const user = userInfo[id];
        const name = user?.name || 'Unknown';
        const isAdmin = adminIDs.includes(id);
        return { id, name, isAdmin };
      });

      members.sort((a: any, b: any) => {
        if (a.isAdmin && !b.isAdmin) return -1;
        if (!a.isAdmin && b.isAdmin) return 1;
        return a.name.localeCompare(b.name);
      });

      const admins = members.filter((m: any) => m.isAdmin);
      const regularMembers = members.filter((m: any) => !m.isAdmin);

      if (admins.length > 0) {
        message += `👑 *Admins (${admins.length}):*\n`;
        admins.forEach((m: any, i: number) => {
          message += `${i + 1}. ${m.name}\n`;
        });
        message += `\n`;
      }

      message += `👤 *Members (${regularMembers.length}):*\n`;
      const displayMembers = regularMembers.slice(0, 20);
      displayMembers.forEach((m: any, i: number) => {
        message += `${i + 1}. ${m.name}\n`;
      });

      if (regularMembers.length > 20) {
        message += `...and ${regularMembers.length - 20} more`;
      }

      await reply(message);
    } catch (error) {
      await reply('❌ Failed to get member list.');
    }
  },
};
