import type { Command, CommandContext } from '../../types/index.js';

const slapMessages = [
  '{user1} slaps {user2} with a wet fish 🐟',
  '{user1} gives {user2} a friendly slap 👋',
  '{user1} slaps {user2} with a rubber chicken 🐔',
  '{user1} slaps {user2} with a keyboard ⌨️',
  '{user1} slaps {user2} with a giant pillow 🛏️',
  '{user1} ninja slaps {user2} 🥷',
  '{user1} slaps {user2} with a flower bouquet 💐',
  '{user1} dramatically slaps {user2} 🎭',
];

const command: Command = {
  name: 'slap',
  aliases: ['sampal'],
  description: 'Slap someone playfully',
  category: 'fun',
  usage: 'slap [@mention]',
  examples: ['slap @user'],

  async execute(context: CommandContext): Promise<void> {
    const { api, event, reply } = context;
    
    let slapperId = ('' + event.senderID).trim();
    let targetId = slapperId;
    let slapperName = 'Someone';
    let targetName = 'themselves';

    if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = ('' + Object.keys(event.mentions)[0]).trim();
    } else if (event.messageReply) {
      targetId = ('' + event.messageReply.senderID).trim();
    }

    try {
      const userInfo = await api.getUserInfo([slapperId, targetId]);
      slapperName = userInfo[slapperId]?.name || 'Someone';
      targetName = targetId === slapperId ? 'themselves' : (userInfo[targetId]?.name || 'someone');
    } catch {}

    const message = slapMessages[Math.floor(Math.random() * slapMessages.length)]
      .replace('{user1}', slapperName)
      .replace('{user2}', targetName);

    await reply(`👋 ${message}`);
  }
};

export default command;
