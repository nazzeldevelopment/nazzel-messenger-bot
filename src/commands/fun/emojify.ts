import type { Command, CommandContext } from '../../types/index.js';

const emojiMap: { [key: string]: string } = {
  'a': '🅰️', 'b': '🅱️', 'c': '©️', 'd': '🇩', 'e': '📧',
  'f': '🎏', 'g': '🇬', 'h': '🏨', 'i': 'ℹ️', 'j': '🎷',
  'k': '🎋', 'l': '🕒', 'm': 'Ⓜ️', 'n': '🇳', 'o': '⭕',
  'p': '🅿️', 'q': '🎯', 'r': '®️', 's': '💲', 't': '✝️',
  'u': '⛎', 'v': '✌️', 'w': '〰️', 'x': '❌', 'y': '💴',
  'z': '💤', '0': '0️⃣', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣',
  '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣',
  '9': '9️⃣', '!': '❗', '?': '❓', ' ': '  '
};

const command: Command = {
  name: 'emojify',
  aliases: ['emoji', 'emojis'],
  description: 'Convert text to emojis',
  category: 'fun',
  usage: 'emojify <text>',
  examples: ['emojify hello', 'emojify hi there'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;

    if (args.length === 0) {
      await reply('📝 Usage: N!emojify <text>\n\nExample: N!emojify hello world');
      return;
    }

    const text = args.join(' ').toLowerCase();
    let result = '';

    for (const char of text) {
      result += emojiMap[char] || char;
    }

    await reply(`✨ Emojified:\n\n${result}`);
  }
};

export default command;
