import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'password',
  aliases: ['genpass', 'passgen'],
  description: 'Generate a random password',
  category: 'utility',
  usage: 'password [length]',
  examples: ['password', 'password 16'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;

    let length = 12;
    if (args.length > 0) {
      const parsed = parseInt(args[0]);
      if (!isNaN(parsed) && parsed >= 4 && parsed <= 32) {
        length = parsed;
      }
    }

    const chars = {
      lower: 'abcdefghijklmnopqrstuvwxyz',
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    const allChars = chars.lower + chars.upper + chars.numbers + chars.symbols;
    let password = '';

    password += chars.lower[Math.floor(Math.random() * chars.lower.length)];
    password += chars.upper[Math.floor(Math.random() * chars.upper.length)];
    password += chars.numbers[Math.floor(Math.random() * chars.numbers.length)];
    password += chars.symbols[Math.floor(Math.random() * chars.symbols.length)];

    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    password = password.split('').sort(() => Math.random() - 0.5).join('');

    await reply(`🔐 *Generated Password*\n\n\`${password}\`\n\n📏 Length: ${length} characters\n✅ Contains: uppercase, lowercase, numbers, symbols\n\n⚠️ Keep this password safe!`);
  }
};

export default command;
