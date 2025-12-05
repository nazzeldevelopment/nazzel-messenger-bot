import type { Command, CommandContext } from '../../types/index.js';
import musicService from '../../services/musicService.js';

export const command: Command = {
  name: 'search',
  aliases: ['find', 'lookup'],
  description: 'Search for songs on YouTube',
  category: 'music',
  usage: 'search <query>',
  examples: ['search Despacito', 'find Shape of You'],
  cooldown: 5000,

  async execute({ event, args, reply, prefix }: CommandContext): Promise<void> {
    if (args.length === 0) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🔍 𝗦𝗘𝗔𝗥𝗖𝗛 𝗠𝗨𝗦𝗜𝗖 🔍     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌── 📖 𝗨𝘀𝗮𝗴𝗲 ──┐
│ ${prefix}search <song name>
└────────────────────┘

┌── 💡 𝗘𝘅𝗮𝗺𝗽𝗹𝗲𝘀 ──┐
│ ${prefix}search Despacito
│ ${prefix}search Ed Sheeran Perfect
└────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎧 Search YouTube for songs`);
      return;
    }

    const query = args.join(' ');
    
    await reply(`🔍 Searching for "${query}"...`);

    try {
      const results = await musicService.searchYouTube(query, 5);

      if (results.length === 0) {
        await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ❌ 𝗡𝗢 𝗥𝗘𝗦𝗨𝗟𝗧𝗦 ❌     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ No songs found for: "${query}"

💡 Try different keywords`);
        return;
      }

      const resultsList = results.map((track, i) => {
        const title = track.title.substring(0, 35) + (track.title.length > 35 ? '...' : '');
        return `│ ${i + 1}. ${title}
│    👤 ${track.artist} • ⏱️ ${musicService.formatDuration(track.duration)}`;
      }).join('\n│\n');

      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🔍 𝗦𝗘𝗔𝗥𝗖𝗛 𝗥𝗘𝗦𝗨𝗟𝗧𝗦 🔍     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌── 🎵 𝗙𝗼𝘂𝗻𝗱 ${results.length} 𝗿𝗲𝘀𝘂𝗹𝘁𝘀 ──┐
${resultsList}
└────────────────────────────┘

┌── 🎛️ 𝗛𝗼𝘄 𝘁𝗼 𝗣𝗹𝗮𝘆 ──┐
│ ${prefix}play <song name>
│ ${prefix}play <number from list>
│ ${prefix}add <URL>
└────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔎 Query: "${query}"`);
    } catch (error) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ❌ 𝗘𝗥𝗥𝗢𝗥 ❌     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚠️ Failed to search for songs.
Please try again later.`);
    }
  }
};
