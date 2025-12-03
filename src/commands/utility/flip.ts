import type { Command, CommandContext } from '../../types/index.js';

const flipTable: { [key: string]: string } = {
  'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ',
  'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l',
  'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ',
  's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
  'y': 'ʎ', 'z': 'z', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ',
  '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '0': '0',
  '.': '˙', ',': '\'', '\'': ',', '"': ',,', '!': '¡', '?': '¿',
  '[': ']', ']': '[', '(': ')', ')': '(', '{': '}', '}': '{',
  '<': '>', '>': '<', '_': '‾', ';': '؛', '&': '⅋'
};

const command: Command = {
  name: 'flip',
  aliases: ['upsidedown', 'reverse'],
  description: 'Flip text upside down',
  category: 'utility',
  usage: 'flip <text>',
  examples: ['flip hello world'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;

    if (args.length === 0) {
      await reply('🔄 Usage: N!flip <text>\n\nExample: N!flip hello world');
      return;
    }

    const text = args.join(' ').toLowerCase();
    let flipped = '';

    for (let i = text.length - 1; i >= 0; i--) {
      const char = text[i];
      flipped += flipTable[char] || char;
    }

    await reply(`🔄 Flipped Text:\n\n${flipped}`);
  }
};

export default command;
