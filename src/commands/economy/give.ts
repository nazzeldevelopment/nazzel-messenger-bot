import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';

export const command: Command = {
  name: 'give',
  aliases: ['pay', 'send'],
  description: 'Give coins to someone',
  category: 'economy',
  usage: 'give @mention <amount>',
  examples: ['give @John 100'],
  cooldown: 10000,
  async execute({ reply, args, event }) {
    const mentions = event.mentions || {};
    const targetId = Object.keys(mentions)[0];
    
    if (!targetId) return reply('❌ Mention someone to give coins to!');
    
    const amount = parseInt(args[1] || args[0]);
    if (isNaN(amount) || amount < 1) return reply('❌ Invalid amount!');
    
    const user = await database.getUserData(event.senderID);
    const balance = user?.coins || 0;
    
    if (amount > balance) return reply(`❌ You only have ${balance} coins!`);
    
    await database.updateUserCoins(event.senderID, -amount);
    await database.updateUserCoins(targetId, amount);
    
    const targetName = Object.values(mentions)[0] || 'User';
    await reply(`💸 SENT\n\n${amount} coins to ${targetName}`);
  },
};
