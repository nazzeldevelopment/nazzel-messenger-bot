import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';

const heistTargets = [
  { name: 'Small Store', minReward: 100, maxReward: 500, successRate: 70 },
  { name: 'Gas Station', minReward: 200, maxReward: 800, successRate: 60 },
  { name: 'Jewelry Shop', minReward: 500, maxReward: 1500, successRate: 45 },
  { name: 'Bank Vault', minReward: 1000, maxReward: 3000, successRate: 30 },
  { name: 'Casino', minReward: 2000, maxReward: 5000, successRate: 20 },
];

const command: Command = {
  name: 'heist',
  aliases: ['robbery', 'steal2', 'bigheist'],
  description: 'Attempt a heist for big rewards',
  category: 'economy',
  usage: 'heist',
  examples: ['heist'],
  cooldown: 300000,

  async execute(context: CommandContext): Promise<void> {
    const { reply, event } = context;
    const userId = event.senderID;

    const target = heistTargets[Math.floor(Math.random() * heistTargets.length)];
    const roll = Math.random() * 100;
    const success = roll <= target.successRate;

    if (success) {
      const reward = Math.floor(Math.random() * (target.maxReward - target.minReward + 1)) + target.minReward;
      await database.addCoins(userId, reward, 'heist', 'Heist reward');
      const balance = await database.getUserCoins(userId);

      await reply(`╭─────────────────╮
│ 🎭 HEIST SUCCESS
╰─────────────────╯

Target: ${target.name}
Result: ✅ SUCCESS!

💰 +${reward.toLocaleString()} coins
💳 Balance: ${balance.toLocaleString()}`);
    } else {
      const fine = Math.floor(Math.random() * 200) + 50;
      await database.removeCoins(userId, fine, 'heist', 'Heist failed - fine');
      const balance = await database.getUserCoins(userId);

      await reply(`╭─────────────────╮
│ 🚨 HEIST FAILED
╰─────────────────╯

Target: ${target.name}
Result: ❌ CAUGHT!

💸 -${fine.toLocaleString()} coins (fine)
💳 Balance: ${balance.toLocaleString()}`);
    }
  }
};

export default command;
