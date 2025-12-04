import type { Command } from '../../types/index.js';
import { decorations } from '../../lib/messageFormatter.js';

const timezones: Record<string, { tz: string; flag: string }> = {
  'ph': { tz: 'Asia/Manila', flag: '🇵🇭' },
  'philippines': { tz: 'Asia/Manila', flag: '🇵🇭' },
  'manila': { tz: 'Asia/Manila', flag: '🇵🇭' },
  'us': { tz: 'America/New_York', flag: '🇺🇸' },
  'est': { tz: 'America/New_York', flag: '🇺🇸' },
  'pst': { tz: 'America/Los_Angeles', flag: '🇺🇸' },
  'uk': { tz: 'Europe/London', flag: '🇬🇧' },
  'london': { tz: 'Europe/London', flag: '🇬🇧' },
  'jp': { tz: 'Asia/Tokyo', flag: '🇯🇵' },
  'japan': { tz: 'Asia/Tokyo', flag: '🇯🇵' },
  'tokyo': { tz: 'Asia/Tokyo', flag: '🇯🇵' },
  'kr': { tz: 'Asia/Seoul', flag: '🇰🇷' },
  'korea': { tz: 'Asia/Seoul', flag: '🇰🇷' },
  'cn': { tz: 'Asia/Shanghai', flag: '🇨🇳' },
  'china': { tz: 'Asia/Shanghai', flag: '🇨🇳' },
  'sg': { tz: 'Asia/Singapore', flag: '🇸🇬' },
  'singapore': { tz: 'Asia/Singapore', flag: '🇸🇬' },
  'au': { tz: 'Australia/Sydney', flag: '🇦🇺' },
  'australia': { tz: 'Australia/Sydney', flag: '🇦🇺' },
  'sydney': { tz: 'Australia/Sydney', flag: '🇦🇺' },
  'utc': { tz: 'UTC', flag: '🌍' },
  'gmt': { tz: 'GMT', flag: '🌍' },
};

export const command: Command = {
  name: 'time',
  aliases: ['clock', 'date', 'now', 'oras'],
  description: 'Get the current time in different timezones',
  category: 'utility',
  usage: 'time [timezone]',
  examples: ['time', 'time ph', 'time japan', 'time utc'],
  cooldown: 3000,

  async execute({ args, reply, prefix }) {
    let tzData = { tz: 'Asia/Manila', flag: '🇵🇭' };
    let locationName = 'Philippines';

    if (args[0]) {
      const input = args[0].toLowerCase();
      if (timezones[input]) {
        tzData = timezones[input];
        locationName = input.charAt(0).toUpperCase() + input.slice(1);
      } else {
        const available = [...new Set(Object.keys(timezones).filter(k => k.length <= 3))];
        await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Unknown timezone!

💡 Try: ${available.join(', ')}`);
        return;
      }
    }

    try {
      const now = new Date();
      
      const dateOptions: Intl.DateTimeFormatOptions = {
        timeZone: tzData.tz,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      
      const timeOptions: Intl.DateTimeFormatOptions = {
        timeZone: tzData.tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };

      const dateStr = now.toLocaleString('en-US', dateOptions);
      const timeStr = now.toLocaleString('en-US', timeOptions);

      await reply(`🕐 『 TIME 』 🕐
═══════════════════════════
${tzData.flag} ${locationName}
═══════════════════════════

◈ DATE
═══════════════════════════
📅 ${dateStr}

◈ TIME
═══════════════════════════
⏰ ${timeStr}

◈ TIMEZONE
═══════════════════════════
🌐 ${tzData.tz}

═══════════════════════════
${decorations.sparkle} Time flies!`);
    } catch (error) {
      await reply(`${decorations.fire} 『 ERROR 』
═══════════════════════════
❌ Failed to get time`);
    }
  },
};
