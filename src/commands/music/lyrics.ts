import type { Command, CommandContext } from '../../types/index.js';
import musicService from '../../services/musicService.js';
import { logger } from '../../lib/logger.js';

export const command: Command = {
  name: 'lyrics',
  aliases: ['ly', 'songlyrics'],
  description: 'Get lyrics for the current or specified song',
  category: 'music',
  usage: 'lyrics [song name]',
  examples: ['lyrics', 'lyrics Bohemian Rhapsody', 'ly Shape of You'],
  cooldown: 5000,

  async execute({ event, args, reply, prefix }: CommandContext): Promise<void> {
    const threadId = event.threadID;
    const session = musicService.getSession(threadId);

    let title = '';
    let artist = '';

    if (args.length === 0) {
      if (!session.currentTrack) {
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     📝 𝗟𝗬𝗥𝗜𝗖𝗦 📝     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌── 📖 𝗨𝘀𝗮𝗴𝗲 ──┐
│ ${prefix}lyrics          (current song)
│ ${prefix}lyrics <song>   (search song)
└────────────────────────┘

┌── 💡 𝗘𝘅𝗮𝗺𝗽𝗹𝗲𝘀 ──┐
│ ${prefix}lyrics
│ ${prefix}lyrics Bohemian Rhapsody
│ ${prefix}lyrics Ed Sheeran Shape of You
└────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ No song playing. Specify a song name.`);
        return;
      }
      
      title = session.currentTrack.title;
      artist = session.currentTrack.artist;
    } else {
      const query = args.join(' ');
      const parts = query.split(' - ');
      if (parts.length >= 2) {
        artist = parts[0].trim();
        title = parts.slice(1).join(' - ').trim();
      } else {
        title = query;
        artist = '';
      }
    }

    await reply(`📝 Searching for lyrics...`);

    try {
      const lyrics = await musicService.fetchLyrics(title, artist);

      if (!lyrics) {
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ❌ 𝗡𝗢𝗧 𝗙𝗢𝗨𝗡𝗗 ❌     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ Could not find lyrics for:
"${title}"${artist ? ` by ${artist}` : ''}

┌── 💡 𝗧𝗶𝗽𝘀 ──┐
│ • Try "Artist - Song Title" format
│ • Check spelling
│ • Try a more popular song
└────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ${prefix}lyrics <artist> - <song>`);
        return;
      }

      const maxLength = 1500;
      let displayLyrics = lyrics;
      let truncated = false;

      if (lyrics.length > maxLength) {
        displayLyrics = lyrics.substring(0, maxLength);
        const lastNewline = displayLyrics.lastIndexOf('\n');
        if (lastNewline > maxLength - 200) {
          displayLyrics = displayLyrics.substring(0, lastNewline);
        }
        truncated = true;
      }

      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     📝 𝗟𝗬𝗥𝗜𝗖𝗦 📝     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌── 🎵 ${title.substring(0, 30)}${title.length > 30 ? '...' : ''} ──┐
${artist ? `│ 👤 ${artist}\n` : ''}└────────────────────────────┘

${displayLyrics}

${truncated ? '\n... (lyrics truncated)\n' : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Lyrics provided by lyrics.ovh`);

      logger.info('Lyrics fetched', { title, artist });
    } catch (error) {
      logger.error('Lyrics fetch failed', { error });
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ❌ 𝗘𝗥𝗥𝗢𝗥 ❌     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ Failed to fetch lyrics.
Please try again later.`);
    }
  }
};
