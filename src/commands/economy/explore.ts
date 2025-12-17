import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';

const locations = [
  { name: 'Forest', emoji: '🌲', rewards: ['🍎 Apple', '🍄 Mushroom', '🪵 Wood'], coins: [10, 50] },
  { name: 'Beach', emoji: '🏖️', rewards: ['🐚 Shell', '🦀 Crab', '💎 Pearl'], coins: [15, 80] },
  { name: 'Cave', emoji: '🕳️', rewards: ['💎 Diamond', '⛏️ Ore', '🦇 Bat Wing'], coins: [30, 150] },
  { name: 'Mountain', emoji: '⛰️', rewards: ['🪨 Rock', '❄️ Ice Crystal', '🦅 Feather'], coins: [20, 100] },
  { name: 'Desert', emoji: '🏜️', rewards: ['🦂 Scorpion', '💀 Bone', '🧭 Compass'], coins: [25, 120] },
  { name: 'Ocean', emoji: '🌊', rewards: ['🐟 Fish', '🦑 Squid', '🔱 Trident Piece'], coins: [35, 180] },
];

const command: Command = {
  name: 'explore',
  aliases: ['adventure2', 'journey', 'wander'],
  description: 'Explore locations for rewards',
  category: 'economy',
  usage: 'explore',
  examples: ['explore'],
  cooldown: 60000,

  async execute(context: CommandContext): Promise<void> {
    const { reply, event } = context;
    const userId = event.senderID;

    const location = locations[Math.floor(Math.random() * locations.length)];
    const reward = location.rewards[Math.floor(Math.random() * location.rewards.length)];
    const coins = Math.floor(Math.random() * (location.coins[1] - location.coins[0] + 1)) + location.coins[0];

    await database.addCoins(userId, coins, 'work', `Explore - ${location.name}`);
    const balance = await database.getUserCoins(userId);

    await reply(`╭─────────────────╮
│ 🗺️ EXPLORE
╰─────────────────╯

${location.emoji} ${location.name}

You found: ${reward}

💰 +${coins.toLocaleString()} coins
💳 Balance: ${balance.toLocaleString()}`);
  }
};

export default command;
