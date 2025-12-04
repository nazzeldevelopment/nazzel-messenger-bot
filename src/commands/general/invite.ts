import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'invite',
  aliases: ['addbot', 'getbot', 'botlink', 'botinvite'],
  description: 'Get information on how to add the bot to your group',
  category: 'general',
  usage: 'invite',
  examples: ['invite'],
  cooldown: 10,

  async execute({ api, config, reply }) {
    const botId = api.getCurrentUserID?.() || 'Bot ID';
    const botName = config.bot.name || 'Nazzel Bot';
    const prefix = config.bot.prefix || 'N!';

    await reply(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ██╗███╗   ██╗██╗   ██╗██╗████████╗███████╗                 ║
║   ██║████╗  ██║██║   ██║██║╚══██╔══╝██╔════╝                 ║
║   ██║██╔██╗ ██║██║   ██║██║   ██║   █████╗                   ║
║   ██║██║╚██╗██║╚██╗ ██╔╝██║   ██║   ██╔══╝                   ║
║   ██║██║ ╚████║ ╚████╔╝ ██║   ██║   ███████╗                 ║
║   ╚═╝╚═╝  ╚═══╝  ╚═══╝  ╚═╝   ╚═╝   ╚══════╝                 ║
║                                                              ║
║              INVITE ${botName.toUpperCase()} TO YOUR GROUP              ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   HOW TO ADD THE BOT                                        ║
║   ─────────────────────────────────────                     ║
║                                                              ║
║   STEP 1: Add the bot as a friend                           ║
║   ────────────────────────────────                          ║
║   Visit: facebook.com/${botId}                         ║
║   Click "Add Friend" and wait for acceptance               ║
║                                                              ║
║   STEP 2: Add to your group chat                            ║
║   ────────────────────────────────                          ║
║   Open your Messenger group chat                            ║
║   Click "Add People" and select the bot                     ║
║                                                              ║
║   STEP 3: Make bot an admin (Recommended)                   ║
║   ────────────────────────────────                          ║
║   For full functionality, make the bot                      ║
║   a group admin                                             ║
║                                                              ║
║   STEP 4: Start using commands!                             ║
║   ────────────────────────────────                          ║
║   Type: ${prefix}help to see all commands                      ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   BOT INFORMATION                                           ║
║   ─────────────────────────────────────                     ║
║   Name    : ${botName}                                         ║
║   ID      : ${botId}                                   ║
║   Prefix  : ${prefix}                                             ║
║   Version : ${config.bot.version || '1.5.0'}                                        ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   NOTE: The bot needs to accept your friend request         ║
║   before you can add it to groups.                          ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝`);
  },
};

export default command;
