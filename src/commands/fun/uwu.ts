import type { Command, CommandContext } from '../../types/index.js';

const uwuFaces = ['(◕ᴗ◕✿)', '(◠‿◠)', '(づ｡◕‿‿◕｡)づ', 'OwO', 'UwU', '(´･ω･`)', '(✿◠‿◠)', '(◕‿◕)', 'ヾ(◕ᴗ◕)ﾉ', '(｡♥‿♥｡)'];

const command: Command = {
  name: 'uwu',
  aliases: ['uwuify', 'owo'],
  description: 'Convert text to UwU speak',
  category: 'fun',
  usage: 'uwu <text>',
  examples: ['uwu hello world'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;

    if (args.length === 0) {
      const face = uwuFaces[Math.floor(Math.random() * uwuFaces.length)];
      await reply(`${face} Usage: N!uwu <text>\n\nExample: N!uwu hello world`);
      return;
    }

    let text = args.join(' ').toLowerCase();
    
    text = text.replace(/r/g, 'w');
    text = text.replace(/l/g, 'w');
    text = text.replace(/n([aeiou])/g, 'ny$1');
    text = text.replace(/ove/g, 'uv');
    text = text.replace(/th/g, 'd');
    text = text.replace(/!/g, '! ' + uwuFaces[Math.floor(Math.random() * uwuFaces.length)] + ' ');
    text = text.replace(/\?/g, '? ' + uwuFaces[Math.floor(Math.random() * uwuFaces.length)] + ' ');

    const face = uwuFaces[Math.floor(Math.random() * uwuFaces.length)];

    await reply(`${face} UwU-ified:\n\n${text} ${face}`);
  }
};

export default command;
