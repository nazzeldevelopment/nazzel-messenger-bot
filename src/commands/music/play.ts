import type { Command, CommandContext } from '../../types/index.js';
import musicService from '../../services/musicService.js';
import { logger } from '../../lib/logger.js';

export const command: Command = {
  name: 'play',
  aliases: ['p', 'playmusic', 'playsong'],
  description: 'Play a song from YouTube or Spotify',
  category: 'music',
  usage: 'play <song name or URL>',
  examples: ['play Never Gonna Give You Up', 'play https://youtube.com/watch?v=...'],
  cooldown: 3000,

  async execute({ api, event, args, reply, prefix }: CommandContext): Promise<void> {
    if (args.length === 0) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🎵 𝗣𝗟𝗔𝗬 𝗠𝗨𝗦𝗜𝗖 🎵     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌── 📖 𝗨𝘀𝗮𝗴𝗲 ──┐
│ ${prefix}play <song/URL>
└────────────────────┘

┌── 💡 𝗘𝘅𝗮𝗺𝗽𝗹𝗲𝘀 ──┐
│ ${prefix}play Despacito
│ ${prefix}play https://youtube.com/...
│ ${prefix}play spotify:track:...
└────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎧 Supports YouTube & Spotify`);
      return;
    }

    const query = args.join(' ');
    const threadId = event.threadID;
    const userId = event.senderID;

    try {
      let track: any = null;

      if (musicService.isYouTubeUrl(query)) {
        await reply(`🔍 Fetching from YouTube...`);
        track = await musicService.getYouTubeInfo(query);
      } else if (musicService.isSpotifyUrl(query)) {
        await reply(`🔍 Fetching from Spotify...`);
        track = await musicService.getSpotifyTrack(query);
      } else {
        await reply(`🔍 Searching for "${query}"...`);
        const results = await musicService.searchYouTube(query, 1);
        if (results.length > 0) {
          track = results[0];
        }
      }

      if (!track) {
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ❌ 𝗡𝗢𝗧 𝗙𝗢𝗨𝗡𝗗 ❌     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ Could not find any song matching:
"${query}"

💡 Try a different search term or URL`);
        return;
      }

      const userInfo = await api.getUserInfo(userId);
      const userName = userInfo[userId]?.name || 'Unknown';
      track.requestedBy = userName;
      track.requestedAt = new Date();

      const session = musicService.getSession(threadId);
      
      if (session.isPlaying && session.currentTrack) {
        const position = musicService.addToQueue(threadId, track);
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     📋 𝗔𝗗𝗗𝗘𝗗 𝗧𝗢 𝗤𝗨𝗘𝗨𝗘 📋     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌── 🎵 𝗧𝗿𝗮𝗰𝗸 𝗜𝗻𝗳𝗼 ──┐
│ 🎶 ${track.title}
│ 👤 ${track.artist}
│ ⏱️ ${musicService.formatDuration(track.duration)}
└────────────────────────┘

┌── 📊 𝗤𝘂𝗲𝘂𝗲 ──┐
│ 📍 Position: #${position}
│ 👤 Requested by: ${userName}
└────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ${prefix}queue to view full queue`);
      } else {
        musicService.playTrack(threadId, track);
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🎵 𝗡𝗢𝗪 𝗣𝗟𝗔𝗬𝗜𝗡𝗚 🎵     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌── 🎶 𝗧𝗿𝗮𝗰𝗸 ──┐
│ 🎵 ${track.title}
│ 👤 ${track.artist}
│ ⏱️ ${musicService.formatDuration(track.duration)}
│ 📺 ${track.source === 'youtube' ? 'YouTube' : 'Spotify'}
└────────────────────────┘

┌── 🎛️ 𝗖𝗼𝗻𝘁𝗿𝗼𝗹𝘀 ──┐
│ ${prefix}pause  ➜ Pause
│ ${prefix}skip   ➜ Next song
│ ${prefix}stop   ➜ Stop playback
│ ${prefix}queue  ➜ View queue
└────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎧 Requested by: ${userName}`);
      }

      logger.info('Music play command executed', { threadId, track: track.title });
    } catch (error) {
      logger.error('Play command failed', { error });
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ❌ 𝗘𝗥𝗥𝗢𝗥 ❌     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ Failed to play the song.
Please try again later.`);
    }
  }
};
