import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';

const crimes = [
  { name: 'Pickpocketing', min: 50, max: 150, fail: 30 },
  { name: 'Shoplifting', min: 100, max: 300, fail: 40 },
  { name: 'Bank Heist', min: 500, max: 1000, fail: 60 },
];

export const command: Command = {
  name: 'crime',
  aliases: ['steal', 'heist'],
  description: 'Commit a crime for coins',
  category: 'economy',
  usage: 'crime',
  examples: ['crime'],
  cooldown: 60000,
  async execute({ reply, event }) {
    const crime = crimes[Math.floor(Math.random() * crimes.length)];
    const success = Math.random() * 100 > crime.fail;
    
    if (success) {
      const amount = Math.floor(Math.random() * (crime.max - crime.min + 1)) + crime.min;
      await database.updateUserCoins(event.senderID, amount);
      await reply(`🦹 CRIME: ${crime.name}\n\n✅ Success!\n+${amount} coins 💰`);
    } else {
      const fine = Math.floor(Math.random() * 100) + 50;
      await database.updateUserCoins(event.senderID, -fine);
      await reply(`🦹 CRIME: ${crime.name}\n\n❌ Caught!\n-${fine} coins (fine)`);
    }
  },
};
