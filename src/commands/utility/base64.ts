import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'base64',
  aliases: ['b64', 'encode'],
  description: 'Encode or decode base64',
  category: 'utility',
  usage: 'base64 <encode|decode> <text>',
  examples: ['base64 encode hello', 'base64 decode aGVsbG8='],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;

    if (args.length < 2) {
      await reply('📝 Usage: N!base64 <encode|decode> <text>\n\nExamples:\n• N!base64 encode hello\n• N!base64 decode aGVsbG8=');
      return;
    }

    const action = args[0].toLowerCase();
    const text = args.slice(1).join(' ');

    try {
      if (action === 'encode') {
        const encoded = Buffer.from(text).toString('base64');
        await reply(`🔐 *Base64 Encoded*\n\n${encoded}`);
      } else if (action === 'decode') {
        const decoded = Buffer.from(text, 'base64').toString('utf-8');
        await reply(`🔓 *Base64 Decoded*\n\n${decoded}`);
      } else {
        await reply('❌ Invalid action. Use "encode" or "decode".');
      }
    } catch (error) {
      await reply('❌ Failed to process. Make sure the text is valid.');
    }
  }
};

export default command;
