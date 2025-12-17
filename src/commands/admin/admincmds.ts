import type { Command } from '../../types/index.js';
export const command: Command = { name: 'admincmds', aliases: ['adminhelp'], description: 'List admin commands', category: 'admin', usage: 'admincmds', examples: ['admincmds'], cooldown: 5000, permissions: ['admin'],
  async execute({ reply }) { await reply('👑 ADMIN COMMANDS\n\nkick, ban, unban, mute, unmute, warn, announce, setprefix, setname, setbio'); },
};
