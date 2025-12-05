import type { Command, CommandContext } from '../../types/index.js';
import musicService from '../../services/musicService.js';

export const command: Command = {
  name: 'nowplaying',
  aliases: ['np', 'current', 'playing'],
  description: 'Show currently playing song info',
  category: 'music',
  usage: 'nowplaying',
  examples: ['nowplaying', 'np'],
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

    const track = session.currentTrack;
    const currentPos = musicService.getCurrentPosition(threadId);
    const progressBar = musicService.createProgressBar(currentPos, track.duration);
    const statusEmoji = session.isPaused ? '⏸️' : '▶️';
    const statusText = session.isPaused ? 'PAUSED' : 'PLAYING';

    const loopEmoji = session.loopMode === 'song' ? '🔂' : session.loopMode === 'queue' ? '🔁' : '➡️';
    const loopText = session.loopMode === 'off' ? 'Off' : session.loopMode === 'song' ? 'Song' : 'Queue';

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🎵 𝗡𝗢𝗪 𝗣𝗟𝗔𝗬𝗜𝗡𝗚 🎵     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌── 🎶 𝗧𝗿𝗮𝗰𝗸 𝗜𝗻𝗳𝗼 ──┐
│ 🎵 ${track.title}
│ 👤 ${track.artist}
│ 📺 ${track.source === 'youtube' ? 'YouTube' : 'Spotify'}
└────────────────────────┘

┌── ⏱️ 𝗣𝗿𝗼𝗴𝗿𝗲𝘀𝘀 ──┐
│ ${progressBar}
│ ${musicService.formatDuration(currentPos)} / ${musicService.formatDuration(track.duration)}
│ ${statusEmoji} Status: ${statusText}
└────────────────────┘

┌── 🎛️ 𝗦𝗲𝘁𝘁𝗶𝗻𝗴𝘀 ──┐
│ 🔊 Volume: ${session.volume}%
│ ${loopEmoji} Loop: ${loopText}
│ 🎚️ Filter: ${session.filter || 'None'}
└────────────────────┘

┌── 📋 𝗤𝘂𝗲𝘂𝗲 ──┐
│ 📊 ${session.queue.length} songs in queue
│ 👤 Requested by: ${track.requestedBy}
└────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎧 ${prefix}queue to view full queue`);
  }
};
