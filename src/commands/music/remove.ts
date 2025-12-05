import type { Command, CommandContext } from '../../types/index.js';
import musicService from '../../services/musicService.js';

export const command: Command = {
  name: 'remove',
  aliases: ['rm', 'delete', 'del'],
  description: 'Remove a song from the queue by position',
  category: 'music',
  usage: 'remove <position>',
  examples: ['remove 1', 'rm 3', 'delete 2'],
  cooldown: 2000,

  async execute({ event, args, reply, prefix }: CommandContext): Promise<void> {
    const threadId = event.threadID;
    const session = musicService.getSession(threadId);

    if (args.length === 0) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🗑️ 𝗥𝗘𝗠𝗢𝗩𝗘 𝗦𝗢𝗡𝗚 🗑️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌── 📖 𝗨𝘀𝗮𝗴𝗲 ──┐
│ ${prefix}remove <position>
└────────────────────┘

┌── 💡 𝗘𝘅𝗮𝗺𝗽𝗹𝗲𝘀 ──┐
│ ${prefix}remove 1
│ ${prefix}remove 3
│ ${prefix}rm 2
└────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 ${prefix}queue to see positions`);
      return;
    }

    const position = parseInt(args[0]);

    if (isNaN(position) || position < 1) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ⚠️ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 ⚠️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ Please provide a valid position number.

💡 Use ${prefix}queue to see song positions`);
      return;
    }

    if (session.queue.length === 0) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ⚠️ 𝗘𝗠𝗣𝗧𝗬 𝗤𝗨𝗘𝗨𝗘 ⚠️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ The queue is empty.

💡 ${prefix}play <song> to add music`);
      return;
    }

    const removed = musicService.removeFromQueue(threadId, position);

    if (!removed) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ⚠️ 𝗡𝗢𝗧 𝗙𝗢𝗨𝗡𝗗 ⚠️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ No song at position #${position}

┌── 📊 𝗤𝘂𝗲𝘂𝗲 𝗜𝗻𝗳𝗼 ──┐
│ 🎵 ${session.queue.length} songs in queue
│ 📍 Valid positions: 1-${session.queue.length}
└────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ${prefix}queue to see all songs`);
      return;
    }

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🗑️ 𝗥𝗘𝗠𝗢𝗩𝗘𝗗 🗑️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ Removed from queue:

┌── 🎵 𝗧𝗿𝗮𝗰𝗸 ──┐
│ 🎶 ${removed.title}
│ 👤 ${removed.artist}
│ ⏱️ ${musicService.formatDuration(removed.duration)}
└────────────────────────┘

┌── 📊 𝗤𝘂𝗲𝘂𝗲 ──┐
│ 🎵 ${session.queue.length} songs remaining
└────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ${prefix}queue to view updated queue`);
  }
};
