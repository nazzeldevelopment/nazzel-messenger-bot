import type { Command, CommandContext } from '../../types/index.js';
import musicService from '../../services/musicService.js';
import { logger } from '../../lib/logger.js';

export const command: Command = {
  name: 'playlist',
  aliases: ['pl', 'importplaylist'],
  description: 'Import a YouTube or Spotify playlist',
  category: 'music',
  usage: 'playlist <URL>',
  examples: ['playlist https://youtube.com/playlist?list=...', 'playlist https://open.spotify.com/playlist/...'],
  cooldown: 10000,

  async execute({ api, event, args, reply, prefix }: CommandContext): Promise<void> {
    if (args.length === 0) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     📋 𝗜𝗠𝗣𝗢𝗥𝗧 𝗣𝗟𝗔𝗬𝗟𝗜𝗦𝗧 📋     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌── 📖 𝗨𝘀𝗮𝗴𝗲 ──┐
│ ${prefix}playlist <URL>
└────────────────────┘

┌── 💡 𝗘𝘅𝗮𝗺𝗽𝗹𝗲𝘀 ──┐
│ ${prefix}playlist https://youtube.com/playlist?list=...
│ ${prefix}playlist https://open.spotify.com/playlist/...
└────────────────────────────────────┘

┌── 🎵 𝗦𝘂𝗽𝗽𝗼𝗿𝘁𝗲𝗱 ──┐
│ ▶️ YouTube Playlists
│ 🟢 Spotify Playlists
└────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎧 Import entire playlists to queue`);
      return;
    }

    const url = args[0];
    const threadId = event.threadID;
    const userId = event.senderID;

    if (!musicService.isPlaylistUrl(url)) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ⚠️ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗨𝗥𝗟 ⚠️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ This doesn't look like a playlist URL.

┌── 📖 𝗩𝗮𝗹𝗶𝗱 𝗙𝗼𝗿𝗺𝗮𝘁𝘀 ──┐
│ ▶️ youtube.com/playlist?list=...
│ 🟢 open.spotify.com/playlist/...
└────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Make sure to use a playlist link`);
      return;
    }

    try {
      await reply(`📋 Importing playlist... This may take a moment.`);

      let tracks: any[] = [];

      if (musicService.isSpotifyUrl(url)) {
        tracks = await musicService.getSpotifyPlaylist(url);
      } else {
        tracks = await musicService.getYouTubePlaylist(url);
      }

      if (tracks.length === 0) {
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ❌ 𝗘𝗠𝗣𝗧𝗬 𝗣𝗟𝗔𝗬𝗟𝗜𝗦𝗧 ❌     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ Could not fetch any songs from this playlist.
It might be empty or private.

💡 Try a different playlist URL`);
        return;
      }

      const userInfo = await api.getUserInfo(userId);
      const userName = userInfo[userId]?.name || 'Unknown';

      let addedCount = 0;
      const maxTracks = 50;

      for (const track of tracks.slice(0, maxTracks)) {
        track.requestedBy = userName;
        track.requestedAt = new Date();
        musicService.addToQueue(threadId, track);
        addedCount++;
      }

      const session = musicService.getSession(threadId);
      const totalDuration = session.queue.reduce((acc, t) => acc + t.duration, 0);
      const source = musicService.isSpotifyUrl(url) ? 'Spotify' : 'YouTube';

      const preview = tracks.slice(0, 3).map((t, i) => 
        `│ ${i + 1}. ${t.title.substring(0, 30)}${t.title.length > 30 ? '...' : ''}`
      ).join('\n');

      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     📋 𝗣𝗟𝗔𝗬𝗟𝗜𝗦𝗧 𝗜𝗠𝗣𝗢𝗥𝗧𝗘𝗗 📋     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ Successfully imported playlist!

┌── 📊 𝗦𝘁𝗮𝘁𝘀 ──┐
│ 🎵 ${addedCount} songs added
│ ⏱️ Total: ${musicService.formatDuration(totalDuration)}
│ 📺 Source: ${source}
│ 👤 By: ${userName}
└────────────────────┘

┌── 🎵 𝗣𝗿𝗲𝘃𝗶𝗲𝘄 ──┐
${preview}
│ ...and ${Math.max(0, addedCount - 3)} more
└────────────────────────┘

${tracks.length > maxTracks ? `⚠️ Limited to ${maxTracks} tracks (${tracks.length} total)` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ${prefix}queue to view • ${prefix}shuffle to mix`);

      logger.info('Playlist imported', { threadId, count: addedCount, source });
    } catch (error) {
      logger.error('Playlist import failed', { error });
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ❌ 𝗘𝗥𝗥𝗢𝗥 ❌     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ Failed to import playlist.
It might be private or unavailable.

💡 Try a different playlist URL`);
    }
  }
};
