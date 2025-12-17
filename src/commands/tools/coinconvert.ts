import type { Command } from '../../types/index.js';

const rates: { [key: string]: number } = {
  USD: 1, PHP: 56.5, EUR: 0.92, GBP: 0.79, JPY: 149.5, KRW: 1320, CNY: 7.24,
};

export const command: Command = {
  name: 'coinconvert',
  aliases: ['currency', 'exchange', 'convert'],
  description: 'Convert currency',
  category: 'tools',
  usage: 'coinconvert <amount> <from> <to>',
  examples: ['coinconvert 100 USD PHP'],
  cooldown: 5000,
  async execute({ reply, args }) {
    if (args.length < 3) return reply('❌ Usage: coinconvert <amount> <from> <to>');
    const amount = parseFloat(args[0]);
    const from = args[1].toUpperCase();
    const to = args[2].toUpperCase();
    
    if (isNaN(amount)) return reply('❌ Invalid amount!');
    if (!rates[from] || !rates[to]) return reply('❌ Currency not supported! Available: USD, PHP, EUR, GBP, JPY, KRW, CNY');
    
    const inUSD = amount / rates[from];
    const result = (inUSD * rates[to]).toFixed(2);
    
    await reply(`💱 CURRENCY CONVERSION\n\n${amount} ${from} = ${result} ${to}\n\n📊 Rate: 1 ${from} = ${(rates[to] / rates[from]).toFixed(4)} ${to}`);
  },
};
