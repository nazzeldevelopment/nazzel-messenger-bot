import type { Command, CommandContext } from '../../types/index.js';

const messages = [
  "Someone in this chat thinks about you a lot 💕",
  "Your smile brightens someone's day here ☀️",
  "Someone secretly admires your personality 🌟",
  "You're someone's favorite person in this group 💝",
  "Someone here gets happy when they see your message 😊",
  "Your presence makes someone's day better 🦋",
  "Someone wishes they could talk to you more 💭",
  "You're special to someone here, even if they don't say it 🌸",
  "Someone appreciates you more than you know 💫",
  "Your kindness hasn't gone unnoticed by someone here 🌺",
];

const command: Command = {
  name: 'secretcrush',
  aliases: ['crush', 'admirer', 'secret'],
  description: 'Get a secret crush message',
  category: 'fun',
  usage: 'secretcrush',
  examples: ['secretcrush'],
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    const message = messages[Math.floor(Math.random() * messages.length)];

    await reply(`╭─────────────────╮
│ 💌 SECRET MESSAGE
╰─────────────────╯

${message}

Who could it be? 🤫`);
  }
};

export default command;
