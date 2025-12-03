import type { Command, CommandContext } from '../../types/index.js';

const colorNames: { [key: string]: string } = {
  'red': '#FF0000', 'blue': '#0000FF', 'green': '#00FF00',
  'yellow': '#FFFF00', 'orange': '#FFA500', 'purple': '#800080',
  'pink': '#FFC0CB', 'black': '#000000', 'white': '#FFFFFF',
  'cyan': '#00FFFF', 'magenta': '#FF00FF', 'lime': '#00FF00',
  'navy': '#000080', 'teal': '#008080', 'maroon': '#800000',
  'olive': '#808000', 'silver': '#C0C0C0', 'gray': '#808080',
  'gold': '#FFD700', 'coral': '#FF7F50', 'salmon': '#FA8072',
};

const command: Command = {
  name: 'color',
  aliases: ['kulay', 'hex'],
  description: 'Get color information or generate random color',
  category: 'utility',
  usage: 'color [name or hex]',
  examples: ['color', 'color red', 'color #FF5733'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;

    let hex: string;
    let name: string;

    if (args.length === 0) {
      hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
      name = 'Random Color';
    } else {
      const input = args[0].toLowerCase();
      
      if (colorNames[input]) {
        hex = colorNames[input];
        name = input.charAt(0).toUpperCase() + input.slice(1);
      } else if (input.startsWith('#') && /^#[0-9A-Fa-f]{6}$/.test(input)) {
        hex = input.toUpperCase();
        name = 'Custom Color';
      } else {
        hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
        name = 'Random Color';
      }
    }

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    await reply(`🎨 *Color Info*\n\n📛 Name: ${name}\n🔢 HEX: ${hex}\n🔴 RGB: rgb(${r}, ${g}, ${b})\n\n🌈 Available colors: red, blue, green, yellow, orange, purple, pink, cyan, gold, coral, etc.`);
  }
};

export default command;
