import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'broadcast',
  aliases: ['bc', 'sendall'],
  description: 'Send a message to all groups (Owner only)',
  category: 'admin',
  usage: 'broadcast <message>',
  examples: ['broadcast Bot will restart in 5 minutes!'],
  cooldown: 60,
  ownerOnly: true,

  async execute({ api, args, reply, sendMessage }) {
    if (!args.length) {
      await reply('❌ Please provide a message to broadcast.\n\nUsage: broadcast <message>');
      return;
    }

    const message = args.join(' ');

    try {
      const threads = await api.getThreadList(100, null, ['INBOX']);

      const groupThreads = threads.filter((t: any) => t.isGroup);
      let sent = 0;
      let failed = 0;

      const broadcastMessage = `📢 *Broadcast Message*\n\n${message}`;

      for (const thread of groupThreads) {
        try {
          const threadId = ('' + thread.threadID).trim();
          await sendMessage(broadcastMessage, threadId);
          sent++;
          await new Promise(r => setTimeout(r, 1500));
        } catch {
          failed++;
        }
      }

      await reply(`📢 *Broadcast Complete*\n\n✅ Sent: ${sent} groups\n❌ Failed: ${failed} groups\n📊 Total: ${groupThreads.length} groups`);
    } catch (error) {
      await reply('❌ Failed to broadcast message.');
    }
  },
};
