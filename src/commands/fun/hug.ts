import type { Command, CommandContext } from '../../types/index.js';
import { decorations } from '../../lib/messageFormatter.js';

const hugMessages = [
  '{user1} gives {user2} a warm hug',
  '{user1} hugs {user2} tightly',
  '{user1} wraps {user2} in a cozy hug',
  '{user1} gives {user2} a bear hug',
  '{user1} hugs {user2} with love',
  '{user1} gives {user2} a comforting hug',
  '{user1} surprises {user2} with a hug',
  '{user1} gives {user2} the biggest hug ever',
  '{user1} sends virtual hugs to {user2}',
  '{user1} embraces {user2} warmly',
];

const hugEmojis = ['🤗', '💕', '🧸', '🐻', '❤️', '🌸', '🎁', '🌟'];

const command: Command = {
  name: 'hug',
  aliases: ['yakap', 'embrace', 'cuddle'],
  description: 'Give someone a warm hug',
  category: 'fun',
  usage: 'hug [@mention]',
  examples: ['hug @user'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, reply, prefix } = context;
    
    let huggerId = ('' + event.senderID).trim();
    let targetId = huggerId;
    let huggerName = 'Someone';
    let targetName = 'themselves';

    if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = ('' + Object.keys(event.mentions)[0]).trim();
    } else if (event.messageReply) {
      targetId = ('' + event.messageReply.senderID).trim();
    }

    try {
      const userInfo = await api.getUserInfo([huggerId, targetId]);
      huggerName = userInfo[huggerId]?.name || 'Someone';
      targetName = targetId === huggerId ? 'themselves' : (userInfo[targetId]?.name || 'someone');
    } catch {}

    const message = hugMessages[Math.floor(Math.random() * hugMessages.length)]
      .replace('{user1}', huggerName)
      .replace('{user2}', targetName);
    
    const emoji = hugEmojis[Math.floor(Math.random() * hugEmojis.length)];

    await reply(`${emoji} 『 HUG 』 ${emoji}
═══════════════════════════

${message}

     🤗
   (づ｡◕‿◕｡)づ

═══════════════════════════
${decorations.heart} Spread the love!`);
  }
};

export default command;
