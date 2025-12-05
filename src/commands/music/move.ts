import type { Command, CommandContext } from '../../types/index.js';
import musicService from '../../services/musicService.js';

export const command: Command = {
  name: 'move',
  aliases: ['mv', 'reorder'],
  description: 'Move a song to a different position in queue',
  category: 'music',
  usage: 'move <from> <to>',
  examples: ['move 3 1', 'mv 5 2'],
  cooldown: 2000,

  async execute({ event, args, reply, prefix }: CommandContext): Promise<void> {
    const threadId = event.threadID;
    const session = musicService.getSession(threadId);

    if (args.length < 2) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     📍 𝗠𝗢𝗩𝗘 𝗦𝗢𝗡𝗚 📍     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌── 📖 𝗨𝘀𝗮𝗴𝗲 ──┐
│ ${prefix}move <from> <to>
└────────────────────┘

┌── 💡 𝗘𝘅𝗮𝗺𝗽𝗹𝗲𝘀 ──┐
│ ${prefix}move 3 1  (move #3 to #1)
│ ${prefix}move 5 2  (move #5 to #2)
└────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ${prefix}queue to see positions`);
      return;
    }

    const from = parseInt(args[0]);
    const to = parseInt(args[1]);

    if (isNaN(from) || isNaN(to) || from < 1 || to < 1) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ⚠️ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 ⚠️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ Please provide valid position numbers.

💡 Use ${prefix}queue to see song positions`);
      return;
    }

    if (session.queue.length < 2) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ⚠️ 𝗖𝗔𝗡'𝗧 𝗠𝗢𝗩𝗘 ⚠️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ Need at least 2 songs in queue to move.

┌── 📊 𝗤𝘂𝗲𝘂𝗲 ──┐
│ 🎵 ${session.queue.length} song(s)
└────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ${prefix}play <song> to add more music`);
      return;
    }

    const trackToMove = session.queue[from - 1];
    const success = musicService.moveInQueue(threadId, from, to);

    if (!success) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ⚠️ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗣𝗢𝗦𝗜𝗧𝗜𝗢𝗡 ⚠️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ Invalid position(s): ${from} → ${to}

┌── 📊 𝗤𝘂𝗲𝘂𝗲 𝗜𝗻𝗳𝗼 ──┐
│ 🎵 ${session.queue.length} songs in queue
│ 📍 Valid positions: 1-${session.queue.length}
└────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ${prefix}queue to see all positions`);
      return;
    }

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     📍 𝗠𝗢𝗩𝗘𝗗 📍     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ Song moved successfully!

┌── 🎵 𝗧𝗿𝗮𝗰𝗸 ──┐
│ 🎶 ${trackToMove.title}
│ 📍 Position: #${from} → #${to}
└────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ${prefix}queue to view updated queue`);
  }
};
