import type { Command, CommandContext } from '../../types/index.js';

const loveMessages = [
  "Sending you lots of love! 💕💕💕",
  "You are loved more than you know! 💗",
  "Here's a virtual hug full of love! 🤗💝",
  "Love you to the moon and back! 🌙💖",
  "Spreading love your way! 💓✨",
  "You deserve all the love in the world! 🌍❤️",
  "Sending positive vibes and love! 🌈💛",
  "You're loved and appreciated! 💜🌟",
  "All my love goes to you! 💘",
  "Wrapped in love just for you! 🎀💕",
];

const command: Command = {
  name: 'sendlove',
  aliases: ['sl', 'loveya', 'spreadlove'],
  description: 'Send love to someone',
  category: 'social',
  usage: 'sendlove [@user]',
  examples: ['sendlove', 'sendlove @bestie'],
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { reply, event } = context;
    
    const message = loveMessages[Math.floor(Math.random() * loveMessages.length)];
    const mentions = event.mentions || {};
    const mentionedUser = Object.keys(mentions)[0];

    if (mentionedUser) {
      await reply(`╭─────────────────╮
│ 💝 LOVE
╰─────────────────╯

To: @${mentions[mentionedUser].replace('@', '')}

${message}`);
    } else {
      await reply(`╭─────────────────╮
│ 💝 LOVE
╰─────────────────╯

${message}`);
    }
  }
};

export default command;
