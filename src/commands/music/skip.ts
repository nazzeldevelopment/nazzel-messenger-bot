import type { Command, CommandContext } from '../../types/index.js';
import musicService from '../../services/musicService.js';

export const command: Command = {
  name: 'skip',
  aliases: ['next', 's', 'sk'],
  description: 'Skip to the next song in queue',
  category: 'music',
  usage: 'skip',
  examples: ['skip'],
  cooldown: 2000,

  async execute({ event, reply, prefix }: CommandContext): Promise<void> {
    const threadId = event.threadID;
    const session = musicService.getSession(threadId);

    if (!session.currentTrack) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ⚠️ 𝗡𝗢 𝗠𝗨𝗦𝗜𝗖 ⚠️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ Nothing is currently playing.

💡 Use ${prefix}play <song> to start playing!`);
      return;
    }

    const skippedTrack = session.currentTrack;
    const nextTrack = musicService.skipTrack(threadId);

    if (nextTrack) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ⏭️ 𝗦𝗞𝗜𝗣𝗣𝗘𝗗 ⏭️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌── ⏮️ 𝗦𝗸𝗶𝗽𝗽𝗲𝗱 ──┐
│ 🎶 ${skippedTrack.title}
└────────────────────┘

┌── 🎵 𝗡𝗼𝘄 𝗣𝗹𝗮𝘆𝗶𝗻𝗴 ──┐
│ 🎶 ${nextTrack.title}
│ 👤 ${nextTrack.artist}
│ ⏱️ ${musicService.formatDuration(nextTrack.duration)}
└────────────────────────┘

┌── 📊 𝗤𝘂𝗲𝘂𝗲 ──┐
│ 📋 ${session.queue.length} songs remaining
│ 🔁 Loop: ${session.loopMode}
└────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎧 Enjoy the music!`);
    } else {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ⏭️ 𝗦𝗞𝗜𝗣𝗣𝗘𝗗 ⏭️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌── ⏮️ 𝗦𝗸𝗶𝗽𝗽𝗲𝗱 ──┐
│ 🎶 ${skippedTrack.title}
└────────────────────┘

┌── 📋 𝗤𝘂𝗲𝘂𝗲 𝗘𝗺𝗽𝘁𝘆 ──┐
│ ⚠️ No more songs in queue
│ 🛑 Playback stopped
└────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ${prefix}play <song> to add more music`);
    }
  }
};
