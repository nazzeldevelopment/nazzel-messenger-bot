import type { Command, CommandContext } from '../../types/index.js';

const asciiArt: { [key: string]: string } = {
  'happy': `
  \\(^▽^)/
  `,
  'sad': `
  (╥﹏╥)
  `,
  'angry': `
  (╬ Ò﹏Ó)
  `,
  'love': `
  (♥‿♥)
  `,
  'cool': `
  (⌐■_■)
  `,
  'shrug': `
  ¯\\_(ツ)_/¯
  `,
  'lenny': `
  ( ͡° ͜ʖ ͡°)
  `,
  'table': `
  (╯°□°)╯︵ ┻━┻
  `,
  'bear': `
  ʕ•ᴥ•ʔ
  `,
  'cat': `
  (=^・^=)
  `,
  'dog': `
  ∪･ω･∪
  `,
  'disapprove': `
  ಠ_ಠ
  `,
};

const command: Command = {
  name: 'ascii',
  aliases: ['art', 'kaomoji'],
  description: 'Get ASCII art/kaomoji',
  category: 'utility',
  usage: 'ascii <type>',
  examples: ['ascii happy', 'ascii lenny', 'ascii shrug'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;

    if (args.length === 0) {
      const types = Object.keys(asciiArt).join(', ');
      await reply(`🎨 Usage: N!ascii <type>\n\nAvailable types: ${types}`);
      return;
    }

    const type = args[0].toLowerCase();
    const art = asciiArt[type];

    if (art) {
      await reply(art.trim());
    } else {
      const types = Object.keys(asciiArt).join(', ');
      await reply(`❓ Unknown type "${type}"\n\nAvailable: ${types}`);
    }
  }
};

export default command;
