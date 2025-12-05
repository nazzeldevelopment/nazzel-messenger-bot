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
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🎰 𝗦𝗟𝗢𝗧 𝗠𝗔𝗖𝗛𝗜𝗡𝗘 🎰     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌── 📖 𝗛𝗼𝘄 𝘁𝗼 𝗣𝗹𝗮𝘆 ──┐
│ ${prefix}slots <amount>
│ 💵 Minimum bet: 10 coins
│ 💵 Maximum bet: 10,000 coins
└─────────────────────────────┘

┌── 💰 𝗣𝗮𝘆𝗼𝘂𝘁𝘀 ──┐
│ 🍒🍒🍒 = 3x
│ 🍋🍋🍋 = 4x
│ 🍊🍊🍊 = 5x
│ 🍇🍇🍇 = 6x
│ ⭐⭐⭐ = 10x
│ 💎💎💎 = 15x
│ 7️⃣7️⃣7️⃣ = 25x 🎊
└────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🍀 Good luck!`);
      return;
    }

    if (bet > 10000) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ⚠️ 𝗕𝗘𝗧 𝗧𝗢𝗢 𝗛𝗜𝗚𝗛 ⚠️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Maximum bet: 10,000 coins
Your bet: ${bet.toLocaleString()} coins

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Try: ${prefix}slots 10000`);
      return;
    }

    const currentCoins = await database.getUserCoins(userId);
    if (currentCoins < bet) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     💸 𝗜𝗡𝗦𝗨𝗙𝗙𝗜𝗖𝗜𝗘𝗡𝗧 💸     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌─────────────────────────────┐
│ 💰 Your Balance: ${currentCoins.toLocaleString()}
│ 🎲 Bet Amount: ${bet.toLocaleString()}
│ ❌ Need: ${(bet - currentCoins).toLocaleString()} more
└─────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 ${prefix}claim ➜ Get daily coins
💡 ${prefix}work ➜ Earn coins`);
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

    const twoMatch = (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) && !payout;

    let headerText = '';
    let resultSection = '';
    
    if (winnings > 0) {
      const profit = winnings - bet;
      headerText = payout >= 10 ? '🎊 𝗝𝗔𝗖𝗞𝗣𝗢𝗧! 🎊' : '🎉 𝗪𝗜𝗡𝗡𝗘𝗥! 🎉';
      resultSection = `┌── 💰 𝗬𝗼𝘂 𝗪𝗼𝗻! ──┐
│ 🎲 Bet: ${bet.toLocaleString()}
│ 💎 Multiplier: ${payout}x
│ 💵 Winnings: +${winnings.toLocaleString()}
│ 📈 Profit: +${profit.toLocaleString()}
└────────────────────────────┘`;
    } else if (twoMatch) {
      headerText = '😮 𝗦𝗢 𝗖𝗟𝗢𝗦𝗘! 😮';
      resultSection = `┌── 💔 𝗔𝗹𝗺𝗼𝘀𝘁! ──┐
│ 🎲 Bet: ${bet.toLocaleString()}
│ 💸 Lost: -${bet.toLocaleString()}
└────────────────────────────┘`;
    } else {
      headerText = '😢 𝗧𝗥𝗬 𝗔𝗚𝗔𝗜𝗡 😢';
      resultSection = `┌── 💔 𝗡𝗼 𝗠𝗮𝘁𝗰𝗵 ──┐
│ 🎲 Bet: ${bet.toLocaleString()}
│ 💸 Lost: -${bet.toLocaleString()}
└────────────────────────────┘`;
    }

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ${headerText}     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌─────────────────────────────┐
│     🎰 SLOT MACHINE 🎰     │
├─────────────────────────────┤
│    ┌─────┬─────┬─────┐    │
│    │  ${result[0]}  │  ${result[1]}  │  ${result[2]}  │    │
│    └─────┴─────┴─────┘    │
└─────────────────────────────┘

${resultSection}

┌── 🏦 𝗕𝗮𝗹𝗮𝗻𝗰𝗲 ──┐
│ 💰 ${newBalance.toLocaleString()} coins
└────────────────────┘`);
  },
};
