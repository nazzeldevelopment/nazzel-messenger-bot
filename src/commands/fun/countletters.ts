import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'countletters',
  aliases: ['lettercount', 'charcount', 'length'],
  description: 'Count letters and characters in text',
  category: 'fun',
  usage: 'countletters <text>',
  examples: ['countletters hello world'],
  cooldown: 3000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length === 0) {
      await reply(`Usage: ${prefix}countletters <text>`);
      return;
    }

    const text = args.join(' ');
    const letters = text.replace(/[^a-zA-Z]/g, '').length;
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    const chars = text.length;
    const spaces = text.split(' ').length - 1;

    await reply(`╭─────────────────╮
│ 📊 COUNT
╰─────────────────╯

📝 Text: "${text.slice(0, 30)}${text.length > 30 ? '...' : ''}"

📏 Characters: ${chars}
🔤 Letters: ${letters}
📖 Words: ${words}
⬜ Spaces: ${spaces}`);
  }
};

export default command;
