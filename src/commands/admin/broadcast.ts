import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'broadcast',
  aliases: ['bc', 'sendall', 'announcement'],
  description: 'Send a professional broadcast message to all groups (Owner only)',
  category: 'admin',
  usage: 'broadcast <message>',
  examples: ['broadcast Bot will restart in 5 minutes!', 'broadcast New update available!'],
  cooldown: 60,
  ownerOnly: true,

  async execute({ api, args, reply, sendMessage, config }) {
    if (!args.length) {
      await reply(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     ██████╗ ██████╗  ██████╗  █████╗ ██████╗  ██████╗ █████╗ ███████╗████████╗   ║
║     ██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝   ║
║     ██████╔╝██████╔╝██║   ██║███████║██║  ██║██║     ███████║███████╗   ██║      ║
║     ██╔══██╗██╔══██╗██║   ██║██╔══██║██║  ██║██║     ██╔══██║╚════██║   ██║      ║
║     ██████╔╝██║  ██║╚██████╔╝██║  ██║██████╔╝╚██████╗██║  ██║███████║   ██║      ║
║     ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝      ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   ERROR: No message provided!                               ║
║                                                              ║
║   Usage: ${config.bot.prefix}broadcast <message>                        ║
║                                                              ║
║   Example:                                                   ║
║   ${config.bot.prefix}broadcast Bot update coming soon!                 ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`);
      return;
    }

    const message = args.join(' ');
    const timestamp = new Date().toLocaleString('en-US', { 
      timeZone: 'Asia/Manila',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    try {
      const threads = await api.getThreadList(100, null, ['INBOX']);
      const groupThreads = threads.filter((t: any) => t.isGroup);
      
      if (groupThreads.length === 0) {
        await reply(`
╔══════════════════════════════════════════════════════════════╗
║                    BROADCAST FAILED                         ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   No group chats found to broadcast to.                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`);
        return;
      }

      await reply(`
╔══════════════════════════════════════════════════════════════╗
║                  BROADCAST INITIATED                        ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   Sending to ${groupThreads.length} groups...                            ║
║   Please wait...                                            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`);

      let sent = 0;
      let failed = 0;

      const broadcastMessage = `
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ██████╗ ██████╗  ██████╗  █████╗ ██████╗  ██████╗ █████╗ ███████╗████████╗   ║
║   ██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝   ║
║   ██████╔╝██████╔╝██║   ██║███████║██║  ██║██║     ███████║███████╗   ██║      ║
║   ██╔══██╗██╔══██╗██║   ██║██╔══██║██║  ██║██║     ██╔══██║╚════██║   ██║      ║
║   ██████╔╝██║  ██║╚██████╔╝██║  ██║██████╔╝╚██████╗██║  ██║███████║   ██║      ║
║   ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝      ║
║                                                              ║
║             OFFICIAL ANNOUNCEMENT FROM ${config.bot.name.toUpperCase()}            ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   ${message}
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   Sent: ${timestamp}                                    ║
║   From: ${config.bot.name} System                                       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`;

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

      const successRate = Math.round((sent / groupThreads.length) * 100);
      const statusBar = '█'.repeat(Math.floor(successRate / 10)) + '░'.repeat(10 - Math.floor(successRate / 10));

      await reply(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ██████╗ ██████╗  ██████╗  █████╗ ██████╗  ██████╗ █████╗ ███████╗████████╗   ║
║   ██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝   ║
║   ██████╔╝██████╔╝██║   ██║███████║██║  ██║██║     ███████║███████╗   ██║      ║
║   ██╔══██╗██╔══██╗██║   ██║██╔══██║██║  ██║██║     ██╔══██║╚════██║   ██║      ║
║   ██████╔╝██║  ██║╚██████╔╝██║  ██║██████╔╝╚██████╗██║  ██║███████║   ██║      ║
║   ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝  ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝      ║
║                                                              ║
║                    BROADCAST COMPLETE                       ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   SUCCESS RATE                                              ║
║   [${statusBar}] ${successRate}%                                   ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   DELIVERY REPORT                                           ║
║   ─────────────────────────────────────                     ║
║   ✓ Successfully Sent    : ${String(sent).padStart(3, ' ')} groups                    ║
║   ✗ Failed to Deliver    : ${String(failed).padStart(3, ' ')} groups                    ║
║   ≡ Total Groups         : ${String(groupThreads.length).padStart(3, ' ')} groups                    ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   Broadcast completed at ${timestamp}              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`);
    } catch (error) {
      await reply(`
╔══════════════════════════════════════════════════════════════╗
║                    BROADCAST ERROR                          ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   Failed to send broadcast message.                         ║
║   Please try again later.                                   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`);
    }
  },
};

export default command;
