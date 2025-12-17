import type { Command, CommandContext } from '../../types/index.js';

const roasts = [
  "You're not stupid, you just have bad luck thinking.",
  "I'd agree with you but then we'd both be wrong.",
  "You're the reason the gene pool needs a lifeguard.",
  "If laughter is the best medicine, your face must be curing the world.",
  "You bring everyone so much joy when you leave.",
  "I'm not insulting you, I'm describing you.",
  "You're proof that evolution can go in reverse.",
  "If you were any more basic, you'd be a pH of 14.",
  "Your secrets are always safe with me. I never even listen when you tell me them.",
  "You're like a cloud. When you disappear, it's a beautiful day.",
  "I'd explain it to you but I left my crayons at home.",
  "You're not completely useless. You can always serve as a bad example.",
  "Your WiFi signal is stronger than your personality.",
  "If I wanted to kill myself, I'd climb your ego and jump to your IQ.",
  "You're the human equivalent of a participation trophy.",
  "I've seen salads that are less bland than you.",
  "You're like Monday, nobody likes you.",
  "If ignorance is bliss, you must be the happiest person alive.",
  "You're about as useful as a screen door on a submarine.",
  "I'm jealous of people who haven't met you.",
];

const command: Command = {
  name: 'roastme',
  aliases: ['rm', 'burnme', 'flame'],
  description: 'Get roasted by the bot',
  category: 'fun',
  usage: 'roastme',
  examples: ['roastme'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    const roast = roasts[Math.floor(Math.random() * roasts.length)];

    await reply(`╭─────────────────╮
│ 🔥 ROAST
╰─────────────────╯

${roast}

😂 Just kidding... maybe`);
  }
};

export default command;
