import type { Command, CommandContext } from '../../types/index.js';

function toAesthetic(text: string): string {
  const normal = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const aesthetic = 'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ０１２３４５６７８９';
  
  return text.split('').map(char => {
    const index = normal.indexOf(char);
    return index !== -1 ? aesthetic[index] : char;
  }).join('');
}

const command: Command = {
  name: 'aesthetic',
  aliases: ['vaporwave', 'wide', 'fullwidth'],
  description: 'Convert text to aesthetic/vaporwave style',
  category: 'fun',
  usage: 'aesthetic <text>',
  examples: ['aesthetic hello world'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length === 0) {
      await reply(`╭─────────────────╮
│ ✨ AESTHETIC
╰─────────────────╯

Usage: ${prefix}aesthetic <text>
Example: ${prefix}aesthetic hello`);
      return;
    }

    const text = args.join(' ');
    const result = toAesthetic(text);

    await reply(`╭─────────────────╮
│ ✨ ＡＥＳＴＨＥＴＩＣ
╰─────────────────╯

${result}`);
  }
};

export default command;
