import type { Command, CommandContext } from '../../types/index.js';

function owoify(text: string): string {
  const faces = ['(・`ω´・)', ';;w;;', 'owo', 'UwU', '>w<', '^w^', '(ᵘʷᵘ)', '(ᵔᴥᵔ)', 'ʕ•ᴥ•ʔ', '(◕ᴗ◕✿)'];
  
  let result = text
    .replace(/r|l/g, 'w')
    .replace(/R|L/g, 'W')
    .replace(/n([aeiou])/g, 'ny$1')
    .replace(/N([AEIOU])/g, 'NY$1')
    .replace(/ove/g, 'uv')
    .replace(/th/g, 'd')
    .replace(/TH/g, 'D')
    .replace(/!/g, '! ' + faces[Math.floor(Math.random() * faces.length)] + ' ');

  if (Math.random() > 0.7) {
    result = result + ' ' + faces[Math.floor(Math.random() * faces.length)];
  }

  return result;
}

const command: Command = {
  name: 'owoify',
  aliases: ['owo2', 'uwuify', 'cute'],
  description: 'Convert text to owo/uwu speak',
  category: 'fun',
  usage: 'owoify <text>',
  examples: ['owoify hello there friend'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length === 0) {
      await reply(`╭─────────────────╮
│ 🌸 OWOIFY
╰─────────────────╯

Usage: ${prefix}owoify <text>
Exampwe: ${prefix}owoify hewwo UwU`);
      return;
    }

    const text = args.join(' ');
    const result = owoify(text);

    await reply(`╭─────────────────╮
│ 🌸 OwO
╰─────────────────╯

${result}`);
  }
};

export default command;
