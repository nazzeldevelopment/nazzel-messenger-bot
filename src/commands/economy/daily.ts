import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';

export const command: Command = {
  name: 'daily',
  aliases: ['dailyreward', 'dailybonus'],
  description: 'Claim your daily reward',
  category: 'economy',
  usage: 'daily',
  examples: ['daily'],
  cooldown: 5000,
  async execute({ reply, event }) {
    const userId = event.senderID;
    const lastClaim = await database.getSetting(`daily_${userId}`);
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    
    if (lastClaim && (now - Number(lastClaim)) < day) {
      const remaining = Math.ceil((day - (now - Number(lastClaim))) / (60 * 60 * 1000));
      return reply(`⏰ Already claimed!\n\nCome back in ${remaining} hours.`);
    }
    
    const reward = Math.floor(Math.random() * 500) + 100;
    await database.updateUserCoins(userId, reward);
    await database.setSetting(`daily_${userId}`, now);
    
    await reply(`🎁 DAILY REWARD\n\n+${reward} coins! 💰\n\nCome back tomorrow for more!`);
  },
};
