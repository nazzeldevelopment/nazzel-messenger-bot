import type { Command } from '../../types/index.js';

const timezones: Record<string, string> = {
  'ph': 'Asia/Manila',
  'philippines': 'Asia/Manila',
  'manila': 'Asia/Manila',
  'us': 'America/New_York',
  'est': 'America/New_York',
  'pst': 'America/Los_Angeles',
  'uk': 'Europe/London',
  'london': 'Europe/London',
  'jp': 'Asia/Tokyo',
  'japan': 'Asia/Tokyo',
  'tokyo': 'Asia/Tokyo',
  'kr': 'Asia/Seoul',
  'korea': 'Asia/Seoul',
  'cn': 'Asia/Shanghai',
  'china': 'Asia/Shanghai',
  'sg': 'Asia/Singapore',
  'singapore': 'Asia/Singapore',
  'au': 'Australia/Sydney',
  'australia': 'Australia/Sydney',
  'sydney': 'Australia/Sydney',
  'utc': 'UTC',
  'gmt': 'GMT',
};

export const command: Command = {
  name: 'time',
  aliases: ['clock', 'date', 'now'],
  description: 'Get the current time in different timezones',
  category: 'utility',
  usage: 'time [timezone]',
  examples: ['time', 'time ph', 'time japan', 'time utc'],
  cooldown: 3,

  async execute({ args, reply }) {
    let timezone = 'Asia/Manila';
    let locationName = 'Philippines';

    if (args[0]) {
      const input = args[0].toLowerCase();
      if (timezones[input]) {
        timezone = timezones[input];
        locationName = input.charAt(0).toUpperCase() + input.slice(1);
      } else {
        await reply(`❌ Unknown timezone! Available: ${Object.keys(timezones).join(', ')}`);
        return;
      }
    }

    try {
      const now = new Date();
      
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };

      const formatted = now.toLocaleString('en-US', options);
      const [datePart, timePart] = formatted.split(' at ') || [formatted, ''];

      let message = `🕐 *Current Time*\n\n`;
      message += `📍 Location: ${locationName}\n`;
      message += `📅 Date: ${datePart}\n`;
      message += `⏰ Time: ${timePart || formatted}\n`;
      message += `🌐 Timezone: ${timezone}`;

      await reply(message);
    } catch (error) {
      await reply('❌ Failed to get time information.');
    }
  },
};
