import type { Command, CommandContext } from '../../types/index.js';

const faqs = [
  { q: 'How do I use commands?', a: 'Type the prefix followed by the command name. Example: N!help' },
  { q: 'How do I earn coins?', a: 'Use commands like N!work, N!daily, N!fish, N!hunt, N!beg to earn coins!' },
  { q: 'How do I level up?', a: 'Send messages in the chat! You earn XP for each message you send.' },
  { q: 'What is the prefix?', a: 'The default prefix is N! but admins can change it per group.' },
  { q: 'How do I play music?', a: 'Use N!play <song name or URL> to play music from YouTube!' },
  { q: 'How do I check my balance?', a: 'Use N!balance or N!bal to see your coins and stats.' },
  { q: 'How do I report a bug?', a: 'Use N!report <description> to report bugs to the developers.' },
  { q: 'Who made this bot?', a: 'This bot was created by the Nazzel team. Use N!owner for more info.' },
];

const command: Command = {
  name: 'faq',
  aliases: ['faqs', 'questions', 'qa'],
  description: 'View frequently asked questions about the bot',
  category: 'general',
  usage: 'faq [number]',
  examples: ['faq', 'faq 1'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args[0]) {
      const num = parseInt(args[0]);
      if (num >= 1 && num <= faqs.length) {
        const faq = faqs[num - 1];
        await reply(`╭─────────────────╮
│ ❓ FAQ #${num}
╰─────────────────╯

Q: ${faq.q}

A: ${faq.a.replace(/N!/g, prefix)}`);
        return;
      }
    }

    let msg = `╭─────────────────╮
│ ❓ FAQ
╰─────────────────╯

`;
    faqs.forEach((faq, i) => {
      msg += `${i + 1}. ${faq.q}\n`;
    });
    msg += `\n💡 ${prefix}faq <number> for answer`;

    await reply(msg);
  }
};

export default command;
