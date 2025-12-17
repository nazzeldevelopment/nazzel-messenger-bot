import type { Command, CommandContext } from '../../types/index.js';

const encouragements = [
  "You've got this! Keep going! 💪",
  "Believe in yourself - you're amazing! ⭐",
  "Every step forward counts, no matter how small 🚀",
  "You're stronger than you think! 💎",
  "Don't give up, you're almost there! 🎯",
  "Your hard work will pay off! 🌟",
  "You're capable of incredible things! ✨",
  "Keep pushing, success is around the corner! 🏆",
  "You inspire others with your determination! 🔥",
  "Today is your day to shine! ☀️",
  "Never doubt your abilities! 💫",
  "You're making progress every single day! 📈",
];

const command: Command = {
  name: 'encourage',
  aliases: ['motivate', 'inspire', 'cheeup'],
  description: 'Send encouragement to someone',
  category: 'social',
  usage: 'encourage [@user]',
  examples: ['encourage', 'encourage @friend'],
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { reply, event } = context;
    
    const message = encouragements[Math.floor(Math.random() * encouragements.length)];
    const mentions = event.mentions || {};
    const mentionedUser = Object.keys(mentions)[0];

    if (mentionedUser) {
      await reply(`╭─────────────────╮
│ 🌟 ENCOURAGE
╰─────────────────╯

To: @${mentions[mentionedUser].replace('@', '')}

${message}`);
    } else {
      await reply(`╭─────────────────╮
│ 🌟 ENCOURAGE
╰─────────────────╯

${message}`);
    }
  }
};

export default command;
