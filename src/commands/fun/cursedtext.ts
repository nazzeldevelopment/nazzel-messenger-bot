import type { Command, CommandContext } from '../../types/index.js';

const zalgoChars = [
  '\u0300', '\u0301', '\u0302', '\u0303', '\u0304', '\u0305', '\u0306', '\u0307',
  '\u0308', '\u0309', '\u030a', '\u030b', '\u030c', '\u030d', '\u030e', '\u030f',
  '\u0310', '\u0311', '\u0312', '\u0313', '\u0314', '\u0315', '\u0316', '\u0317',
  '\u0318', '\u0319', '\u031a', '\u031b', '\u031c', '\u031d', '\u031e', '\u031f',
  '\u0320', '\u0321', '\u0322', '\u0323', '\u0324', '\u0325', '\u0326', '\u0327',
  '\u0328', '\u0329', '\u032a', '\u032b', '\u032c', '\u032d', '\u032e', '\u032f',
];

function cursify(text: string): string {
  let result = '';
  for (const char of text) {
    result += char;
    const numChars = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < numChars; i++) {
      result += zalgoChars[Math.floor(Math.random() * zalgoChars.length)];
    }
  }
  return result;
}

const command: Command = {
  name: 'cursedtext',
  aliases: ['cursed', 'creepy', 'glitch'],
  description: 'Convert text to cursed/glitchy text',
  category: 'fun',
  usage: 'cursedtext <text>',
  examples: ['cursedtext hello world'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length === 0) {
      await reply(`╭─────────────────╮
│ 👻 CURSED TEXT
╰─────────────────╯

Usage: ${prefix}cursedtext <text>
Example: ${prefix}cursedtext hello`);
      return;
    }

    const text = args.join(' ');
    const cursed = cursify(text);

    await reply(`╭─────────────────╮
│ 👻 CURSED
╰─────────────────╯

${cursed}`);
  }
};

export default command;
