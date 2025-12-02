import type { Command } from '../../types/index.js';

const changelog = [
  {
    version: '1.1.0',
    date: '2024-12-02',
    changes: [
      'Migrated from facebook-chat-api to ws3-fca 3.4.2',
      'Added 20+ new commands across all categories',
      'New Fun commands: joke, quote, trivia, rps, fact, roast, compliment, horoscope',
      'New Utility commands: avatar, remind, poll, calc, time, translate, shorten',
      'New Admin commands: ban, unban, setname, setemoji, setnickname, adminlist, broadcast',
      'Improved command handler and error handling',
    ],
  },
  {
    version: '1.0.0',
    date: '2024-12-01',
    changes: [
      'Initial release',
      'Core bot functionality with ws3-fca',
      'PostgreSQL database integration',
      'Redis caching layer',
      'XP and leveling system',
      'Music player with YouTube support',
      '27 commands across 6 categories',
      'Express API server for status monitoring',
    ],
  },
];

export const command: Command = {
  name: 'changelog',
  aliases: ['changes', 'updates', 'version'],
  description: 'Show recent bot updates and changes',
  category: 'general',
  usage: 'changelog [version]',
  examples: ['changelog', 'changelog 1.0.0'],
  cooldown: 5,

  async execute({ args, reply }) {
    if (args[0]) {
      const version = changelog.find(c => c.version === args[0]);
      if (!version) {
        await reply(`❌ Version ${args[0]} not found.\n\nAvailable versions: ${changelog.map(c => c.version).join(', ')}`);
        return;
      }

      let message = `📋 *Changelog v${version.version}*\n`;
      message += `📅 Date: ${version.date}\n\n`;
      message += `*Changes:*\n`;
      version.changes.forEach(change => {
        message += `• ${change}\n`;
      });

      await reply(message);
      return;
    }

    let message = `📋 *Bot Changelog*\n\n`;

    changelog.forEach(entry => {
      message += `*v${entry.version}* (${entry.date})\n`;
      entry.changes.slice(0, 3).forEach(change => {
        message += `  • ${change}\n`;
      });
      if (entry.changes.length > 3) {
        message += `  • ...and ${entry.changes.length - 3} more\n`;
      }
      message += `\n`;
    });

    message += `Use \`changelog <version>\` to see full details.`;

    await reply(message);
  },
};
