import type { Command } from '../../types/index.js';
import { decorations } from '../../lib/messageFormatter.js';

const changelog = [
  {
    version: '1.6.0',
    date: '2025-12-04',
    changes: [
      'Complete UI redesign with professional colorful styling',
      'Removed box-style formatting for modern gradient look',
      'Added 20+ new commands across all categories',
      'New message formatter with themed styling',
      'Each category has unique visual identity',
      'Improved user experience with cleaner output',
    ],
  },
  {
    version: '1.5.0',
    date: '2025-12-04',
    changes: [
      'Migrated to pnpm 10.24.0 package manager',
      'Added prefix change command per group',
      'Professional ASCII-art box layouts',
      'Enhanced broadcast command for owner',
      'Database prefix storage in MongoDB',
    ],
  },
  {
    version: '1.4.0',
    date: '2025-12-04',
    changes: [
      'Professional Welcome/Leave messages',
      'Maintenance mode system',
      'Bad words filter with warnings',
      '15 new fun commands added',
      'New utility and moderation commands',
    ],
  },
  {
    version: '1.3.6',
    date: '2025-12-04',
    changes: [
      'Migrated to bituin-fca',
      'Improved MQTT connection reliability',
      'Auto-cycle reconnection every hour',
      'Better group chat compatibility',
    ],
  },
];

export const command: Command = {
  name: 'changelog',
  aliases: ['changes', 'updates', 'version', 'whatsnew'],
  description: 'Show recent bot updates and changes',
  category: 'general',
  usage: 'changelog [version]',
  examples: ['changelog', 'changelog 1.5.0'],
  cooldown: 5000,

  async execute({ args, reply, prefix }) {
    if (args[0]) {
      const version = changelog.find(c => c.version === args[0]);
      if (!version) {
        const versions = changelog.map(c => c.version).join(', ');
        await reply(`${decorations.fire} 『 NOT FOUND 』
━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Version ${args[0]} not found

📋 Available: ${versions}`);
        return;
      }

      let msg = `${decorations.sparkle} 『 v${version.version} 』 ${decorations.sparkle}
━━━━━━━━━━━━━━━━━━━━━━━━━
📅 ${version.date}

◈ CHANGES
━━━━━━━━━━━━━━━━━━━━━━━━━`;
      
      version.changes.forEach((change, i) => {
        const bullets = ['◆', '◇', '●', '○', '▸', '★'];
        msg += `\n${bullets[i % bullets.length]} ${change}`;
      });

      msg += `\n━━━━━━━━━━━━━━━━━━━━━━━━━`;
      await reply(msg);
      return;
    }

    let msg = `${decorations.gem} 『 CHANGELOG 』 ${decorations.gem}
━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.sparkle} Recent Updates\n`;

    const versionEmojis = ['🆕', '📦', '🔧', '🛠️'];
    
    changelog.slice(0, 4).forEach((entry, idx) => {
      const emoji = versionEmojis[idx % versionEmojis.length];
      msg += `
${emoji} v${entry.version} (${entry.date})
━━━━━━━━━━━━━━━━━━━━━━━━━`;
      entry.changes.slice(0, 2).forEach(change => {
        msg += `\n  ➤ ${change}`;
      });
      if (entry.changes.length > 2) {
        msg += `\n  ➤ +${entry.changes.length - 2} more...`;
      }
      msg += '\n';
    });

    msg += `
━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ${prefix}changelog <version>`;

    await reply(msg);
  },
};
