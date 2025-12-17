import type { Command } from '../../types/index.js';
import config from '../../../config.json' with { type: 'json' };

export const command: Command = {
  name: 'owner',
  aliases: ['dev', 'developer', 'creator'],
  description: 'Show bot owner info',
  category: 'general',
  usage: 'owner',
  examples: ['owner'],
  cooldown: 5000,
  async execute({ reply }) {
    const ownerIds = (config.bot as any).ownerIds || [];
    await reply(`👑 BOT OWNER\n\n${ownerIds.length > 0 ? `Owner IDs: ${ownerIds.join(', ')}` : 'No owners configured'}\n\n💌 Contact the owner for support!`);
  },
};
