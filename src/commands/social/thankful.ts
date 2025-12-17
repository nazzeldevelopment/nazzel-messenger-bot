import type { Command, CommandContext } from '../../types/index.js';

const gratitudes = [
  "I'm grateful for having you in my life 💕",
  "Thank you for being such an amazing friend 🌟",
  "I appreciate everything you do 💝",
  "You make this world a better place ✨",
  "Blessed to know you 🙏",
  "Your kindness means everything to me 💖",
  "I'm lucky to have you around 🍀",
  "Thank you for always being there 🤗",
  "You inspire me every day 🌈",
  "Grateful for your friendship 💛",
];

const command: Command = {
  name: 'thankful',
  aliases: ['grateful', 'appreciate', 'blessed'],
  description: 'Express gratitude to someone',
  category: 'social',
  usage: 'thankful [@user]',
  examples: ['thankful', 'thankful @John'],
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, event } = context;
    
    const message = gratitudes[Math.floor(Math.random() * gratitudes.length)];
    const mentions = event.mentions || {};
    const mentionedUser = Object.keys(mentions)[0];

    if (mentionedUser) {
      await reply(`╭─────────────────╮
│ 🙏 THANKFUL
╰─────────────────╯

To: @${mentions[mentionedUser].replace('@', '')}

${message}`);
    } else {
      await reply(`╭─────────────────╮
│ 🙏 THANKFUL
╰─────────────────╯

${message}

Spread gratitude today! 💝`);
    }
  }
};

export default command;
