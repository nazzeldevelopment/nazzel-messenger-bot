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

  async execute({ api, args, reply }) {
    if (!args.length) {
      await reply('❌ Please provide a message to broadcast.\n\nUsage: broadcast <message>');
      return;
    }

    const message = args.join(' ');

    try {
      const threads = await new Promise<any[]>((resolve, reject) => {
        api.getThreadList(100, null, ['INBOX'], (err: Error | null, list: any[]) => {
          if (err) reject(err);
          else resolve(list);
        });
      });

      const groupThreads = threads.filter(t => t.isGroup);
      let sent = 0;
      let failed = 0;

      const broadcastMessage = `📢 *Broadcast Message*\n\n${message}`;

      for (const thread of groupThreads) {
        try {
          const threadId = String(thread.threadID);
          await new Promise<void>((resolve, reject) => {
            api.sendMessage(broadcastMessage, threadId, (err: Error | null) => {
              if (err) reject(err);
              else resolve();
            });
          });
          sent++;
          await new Promise(r => setTimeout(r, 1000));
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
