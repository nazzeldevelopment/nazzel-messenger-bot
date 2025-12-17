import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';

export const command: Command = {
  name: 'deposit',
  aliases: ['dep', 'bank'],
  description: 'Deposit coins to bank',
  category: 'economy',
  usage: 'deposit <amount/all>',
  examples: ['deposit 100', 'deposit all'],
  cooldown: 5000,
  async execute({ reply, args, event }) {
    if (!args.length) return reply('❌ How much to deposit? Use: deposit <amount>');
    
    const user = await database.getUserData(event.senderID);
    const wallet = user?.coins || 0;
    
    let amount: number;
    if (args[0].toLowerCase() === 'all') {
      amount = wallet;
    } else {
      amount = parseInt(args[0]);
    }
    
    if (isNaN(amount) || amount < 1) return reply('❌ Invalid amount!');
    if (amount > wallet) return reply(`❌ You only have ${wallet} coins!`);
    
    await database.updateUserCoins(event.senderID, -amount);
    const currentBank = Number(await database.getSetting(`bank_${event.senderID}`)) || 0;
    await database.setSetting(`bank_${event.senderID}`, currentBank + amount);
    
    await reply(`🏦 DEPOSITED\n\n+${amount} coins to bank\n\nBank balance: ${currentBank + amount} coins`);
  },
};
