import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'shorten',
  aliases: ['short', 'tinyurl', 'url'],
  description: 'Get a shortened URL format',
  category: 'utility',
  usage: 'shorten <url>',
  examples: ['shorten https://www.google.com', 'shorten facebook.com'],
  cooldown: 5,

  async execute({ args, reply }) {
    if (!args[0]) {
      await reply(`🔗 *URL Shortener*\n\nUsage: shorten <url>\n\nExample: shorten https://www.google.com`);
      return;
    }

    let url = args[0];
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    try {
      new URL(url);
    } catch {
      await reply('❌ Invalid URL format!');
      return;
    }

    const shortServices = [
      `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`,
      `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`,
    ];

    let message = `🔗 *URL Shortener*\n\n`;
    message += `📎 Original URL:\n${url}\n\n`;
    message += `✂️ Shortened URLs:\n`;
    message += `• TinyURL: tinyurl.com/create.php?url=${encodeURIComponent(url)}\n`;
    message += `• is.gd: is.gd/create.php?url=${encodeURIComponent(url)}\n\n`;
    message += `💡 Visit the links above to get your shortened URL!`;

    await reply(message);
  },
};
