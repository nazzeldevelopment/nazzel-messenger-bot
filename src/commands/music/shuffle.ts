import type { Command, CommandContext } from '../../types/index.js';
import musicService from '../../services/musicService.js';

export const command: Command = {
  name: 'shuffle',
  aliases: ['mix', 'random'],
  description: 'Shuffle the music queue',
  category: 'music',
  usage: 'shuffle',
  examples: ['shuffle'],
  cooldown: 5000,

  async execute({ event, reply, prefix }: CommandContext): Promise<void> {
    const threadId = event.threadID;
    const session = musicService.getSession(threadId);

    if (session.queue.length < 2) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ⚠️ 𝗖𝗔𝗡'𝗧 𝗦𝗛𝗨𝗙𝗙𝗟𝗘 ⚠️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ Not enough songs in queue to shuffle.
Need at least 2 songs.

┌── 📊 𝗖𝘂𝗿𝗿𝗲𝗻𝘁 𝗤𝘂𝗲𝘂𝗲 ──┐
│ 🎵 ${session.queue.length} song(s)
└────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ${prefix}play <song> to add more music`);
      return;
    }

    musicService.shuffleQueue(threadId);

    const preview = session.queue.slice(0, 3).map((track, i) => 
      `│ ${i + 1}. ${track.title.substring(0, 30)}${track.title.length > 30 ? '...' : ''}`
    ).join('\n');

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🔀 𝗦𝗛𝗨𝗙𝗙𝗟𝗘𝗗 🔀     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ Queue has been shuffled!

┌── 📋 𝗡𝗲𝘄 𝗢𝗿𝗱𝗲𝗿 (𝗣𝗿𝗲𝘃𝗶𝗲𝘄) ──┐
${preview}
│ ...and ${Math.max(0, session.queue.length - 3)} more
└────────────────────────────┘

┌── 📊 𝗦𝘁𝗮𝘁𝘀 ──┐
│ 🎵 ${session.queue.length} songs shuffled
└────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ${prefix}queue to view full queue`);
  }
};
