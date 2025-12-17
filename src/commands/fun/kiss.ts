import type { Command, CommandContext } from '../../types/index.js';
import { safeGetUserInfo } from '../../lib/apiHelpers.js';
import { decorations } from '../../lib/messageFormatter.js';

const kissMessages = [
  '{user1} gives {user2} a sweet kiss',
  '{user1} kisses {user2} on the cheek',
  '{user1} blows a kiss to {user2}',
  '{user1} gives {user2} a forehead kiss',
  '{user1} shyly kisses {user2}',
  '{user1} gives {user2} butterfly kisses',
  '{user1} kisses {user2} goodnight',
  '{user1} surprises {user2} with a kiss',
  '{user1} sends virtual kisses to {user2}',
  '{user1} pecks {user2} sweetly',
];

const kissEmojis = ['😘', '💋', '💕', '🥰', '😊', '🦋', '🌙', '❤️'];

const command: Command = {
  name: 'kiss',
  aliases: ['halik', 'mwah', 'smooch'],
  description: 'Give someone a sweet kiss',
  category: 'fun',
  usage: 'kiss [@mention]',
  examples: ['kiss @user'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, reply, prefix } = context;
    
    let kisserId = ('' + event.senderID).trim();
    let targetId = kisserId;
    let kisserName = 'Someone';
    let targetName = 'themselves';

    if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = ('' + Object.keys(event.mentions)[0]).trim();
    } else if (event.messageReply) {
      targetId = ('' + event.messageReply.senderID).trim();
    }

    try {
      const userInfo = await safeGetUserInfo(api, [kisserId, targetId]);
      kisserName = userInfo[kisserId]?.name || 'Someone';
      targetName = targetId === kisserId ? 'themselves' : (userInfo[targetId]?.name || 'someone');
    } catch {}

    const message = kissMessages[Math.floor(Math.random() * kissMessages.length)]
      .replace('{user1}', kisserName)
      .replace('{user2}', targetName);
    
    const emoji = kissEmojis[Math.floor(Math.random() * kissEmojis.length)];

    await reply(`${emoji} 『 KISS 』 ${emoji}
═══════════════════════════

${message}

     💋
   (´ε｀ )♡

═══════════════════════════
${decorations.heart} Sweet moments!`);
  }
};

export default command;
