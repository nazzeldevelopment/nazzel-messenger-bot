import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';

const SYMBOLS = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣'];
const PAYOUTS: Record<string, number> = {
  '🍒🍒🍒': 3,
  '🍋🍋🍋': 4,
  '🍊🍊🍊': 5,
  '🍇🍇🍇': 6,
  '⭐⭐⭐': 10,
  '💎💎💎': 15,
  '7️⃣7️⃣7️⃣': 25,
};

function spin(): string[] {
  return [
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
  ];
}

export const command: Command = {
  name: 'slots',
  aliases: ['slot', 'spin', 'jackpot'],
  description: 'Play the slot machine and win big',
  category: 'economy',
  usage: 'slots <bet>',
  examples: ['slots 100', 'slots 500'],
  cooldown: 5000,

  async execute({ api, event, args, reply, prefix }) {
    const userId = ('' + event.senderID).trim();
    const bet = parseInt(args[0], 10);

    if (!args[0] || isNaN(bet) || bet < 10) {
      await reply(`╭─────────────────╮
│ 🎰 Slots
╰─────────────────╯

Usage: ${prefix}slots <bet>
Min: 10 │ Max: 10,000`);
      return;
    }

    if (bet > 10000) {
      await reply(`❌ Max bet: 10,000 coins`);
      return;
    }

    const currentCoins = await database.getUserCoins(userId);
    if (currentCoins < bet) {
      await reply(`❌ Not enough coins.\n💰 Balance: ${currentCoins.toLocaleString()}`);
      return;
    }

    const result = spin();
    const resultStr = result.join('');
    const payout = PAYOUTS[resultStr] || 0;
    const winnings = payout > 0 ? bet * payout : 0;

    let newBalance = 0;
    if (winnings > 0) {
      await database.removeCoins(userId, bet, 'game_loss', 'Slots bet');
      const addResult = await database.addCoins(userId, winnings, 'game_win', `Slots win (${payout}x)`);
      newBalance = addResult.newBalance;
    } else {
      const removeResult = await database.removeCoins(userId, bet, 'game_loss', 'Slots loss');
      newBalance = removeResult.newBalance;
    }

    const isWin = winnings > 0;
    const profit = winnings - bet;

    await reply(`╭─────────────────╮
│ 🎰 [ ${result[0]} ${result[1]} ${result[2]} ]
╰─────────────────╯

${isWin ? `🎉 WIN! ${payout}x\n+${profit.toLocaleString()} coins` : `😢 Lost -${bet.toLocaleString()}`}
💰 Balance: ${newBalance.toLocaleString()}`);
  },
};
