import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'alternatecase',
  aliases: ['altcase', 'mocktext', 'spongebob'],
  description: 'Convert text to aLtErNaTiNg CaSe',
  category: 'utility',
  usage: 'alternatecase <text>',
  examples: ['alternatecase hello world'],
  cooldown: 3000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length === 0) {
      await reply(`Usage: ${prefix}alternatecase <text>`);
      return;
    }

    const text = args.join(' ');
    let result = '';
    let isUpper = false;
    
    for (const char of text) {
      if (/[a-zA-Z]/.test(char)) {
        result += isUpper ? char.toUpperCase() : char.toLowerCase();
        isUpper = !isUpper;
      } else {
        result += char;
      }
    }

    await reply(`╭─────────────────╮
│ 🔀 ALTERNATE
╰─────────────────╯

${result}`);
  }
};

export default command;
