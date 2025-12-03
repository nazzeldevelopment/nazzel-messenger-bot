import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'qr',
  aliases: ['qrcode', 'qrgen'],
  description: 'Generate a QR code link for text/URL',
  category: 'utility',
  usage: 'qr <text or url>',
  examples: ['qr https://facebook.com', 'qr Hello World'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;

    if (args.length === 0) {
      await reply('📱 Usage: N!qr <text or url>\n\nExample: N!qr https://facebook.com');
      return;
    }

    const text = args.join(' ');
    const encodedText = encodeURIComponent(text);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedText}`;

    await reply(`📱 QR Code for: ${text}\n\n🔗 ${qrUrl}`);
  }
};

export default command;
