import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';

const lootBoxes = [
  { type: 'Common', emoji: '📦', minCoins: 10, maxCoins: 50, chance: 60 },
  { type: 'Rare', emoji: '🎁', minCoins: 50, maxCoins: 200, chance: 25 },
  { type: 'Epic', emoji: '💜', minCoins: 200, maxCoins: 500, chance: 12 },
  { type: 'Legendary', emoji: '🌟', minCoins: 500, maxCoins: 1500, chance: 3 },
];

const command: Command = {
  name: 'loot',
  aliases: ['lootbox', 'openbox', 'box'],
  description: 'Open a random loot box',
  category: 'economy',
  usage: 'loot',
  examples: ['loot'],
  cooldown: 120000,

  async execute(context: CommandContext): Promise<void> {
    const { reply, event } = context;
    const userId = event.senderID;

    const roll = Math.random() * 100;
    let cumulative = 0;
    let box = lootBoxes[0];

    for (const lb of lootBoxes) {
      cumulative += lb.chance;
      if (roll <= cumulative) {
        box = lb;
        break;
      }
    }

    const coins = Math.floor(Math.random() * (box.maxCoins - box.minCoins + 1)) + box.minCoins;
    await database.addCoins(userId, coins, 'loot', `${box.type} loot box`);
    const balance = await database.getUserCoins(userId);

    await reply(`╭─────────────────╮
│ ${box.emoji} LOOT BOX
╰─────────────────╯

Rarity: ${box.type}

You received:
💰 ${coins.toLocaleString()} coins!

💳 Balance: ${balance.toLocaleString()}`);
  }
};

export default command;
