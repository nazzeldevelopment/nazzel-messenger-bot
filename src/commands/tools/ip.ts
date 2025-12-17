import type { Command } from '../../types/index.js';
export const command: Command = { name: 'ip', aliases: ['myip', 'ipaddress'], description: 'Get IP info (placeholder)', category: 'tools', usage: 'ip', examples: ['ip'], cooldown: 10000,
  async execute({ reply }) { await reply('🌐 IP lookup requires external API integration!'); },
};
