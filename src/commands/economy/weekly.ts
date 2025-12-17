import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';

export const command: Command = {
  name: 'weekly',
  aliases: ['weeklyreward', 'weeklybonus'],
  description: 'Claim your weekly reward',
  category: 'economy',
  usage: 'weekly',
  examples: ['weekly'],
  cooldown: 5000,
  async execute({ reply, event }) {
    const userId = event.senderID;
    const lastClaim = await database.getSetting(`weekly_${userId}`);
    const now = Date.now();
    const week = 7 * 24 * 60 * 60 * 1000;
    
    if (lastClaim && (now - Number(lastClaim)) < week) {
      const remaining = Math.ceil((week - (now - Number(lastClaim))) / (24 * 60 * 60 * 1000));
      return reply(`⏰ Already claimed!\n\nCome back in ${remaining} days.`);
    }
    
    const reward = Math.floor(Math.random() * 2000) + 1000;
    await database.updateUserCoins(userId, reward);
    await database.setSetting(`weekly_${userId}`, now);
    
    await reply(`🎁 WEEKLY REWARD\n\n+${reward} coins! 💰\n\nCome back next week!`);
  },
};
