import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';

export const command: Command = {
  name: 'gamble',
  aliases: ['bet', 'risk', 'allin'],
  description: 'Gamble your coins with varying odds',
  category: 'economy',
  usage: 'gamble <bet>',
  examples: ['gamble 100', 'gamble 500', 'gamble all'],
  cooldown: 8000,

  async execute({ api, event, args, reply, prefix }) {
    const userId = ('' + event.senderID).trim();
    
    const currentCoins = await database.getUserCoins(userId);
    let bet = parseInt(args[0], 10);
    
    if (args[0]?.toLowerCase() === 'all' || args[0]?.toLowerCase() === 'max') {
      bet = Math.min(currentCoins, 50000);
    }

    if (!args[0] || isNaN(bet) || bet < 10) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🎲 𝗚𝗔𝗠𝗕𝗟𝗘 🎲     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌── 📖 𝗛𝗼𝘄 𝘁𝗼 𝗣𝗹𝗮𝘆 ──┐
│ ${prefix}gamble <amount>
│ ${prefix}gamble all
│ 💵 Min: 10 coins
│ 💵 Max: 50,000 coins
└─────────────────────────────┘

┌── 🎯 𝗪𝗶𝗻 𝗖𝗵𝗮𝗻𝗰𝗲𝘀 ──┐
│ 🟢 45% = 2x payout
│ 🟡 20% = 3x payout
│ 🟠 10% = 5x payout
│ 💎  5% = 10x payout
│ 💔 20% = Loss
└────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 Your balance: ${currentCoins.toLocaleString()} coins`);
      return;
    }

    if (bet > 50000) {
      await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ⚠️ 𝗕𝗘𝗧 𝗧𝗢𝗢 𝗛𝗜𝗚𝗛 ⚠️     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Maximum bet: 50,000 coins
Your bet: ${bet.toLocaleString()} coins

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 Try: ${prefix}gamble 50000`);
      return;
    }

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
💡 ${prefix}claim ➜ Get daily coins`);
      return;
    }

    const roll = Math.random() * 100;
    let multiplier = 0;
    let resultText = '';
    let emoji = '';

    if (roll < 45) {
      multiplier = 2;
      resultText = 'WIN';
      emoji = '🎉';
    } else if (roll < 65) {
      multiplier = 3;
      resultText = 'BIG WIN';
      emoji = '💰';
    } else if (roll < 75) {
      multiplier = 5;
      resultText = 'HUGE WIN';
      emoji = '🌟';
    } else if (roll < 80) {
      multiplier = 10;
      resultText = 'JACKPOT';
      emoji = '💎';
    } else {
      multiplier = 0;
      resultText = 'LOST';
      emoji = '💔';
    }

    const winnings = bet * multiplier;
    let newBalance = 0;
    let profit = 0;

    if (multiplier > 0) {
      profit = winnings - bet;
      const addResult = await database.addCoins(userId, profit, 'game_win', `Gamble win (${multiplier}x)`);
      newBalance = addResult.newBalance;
    } else {
      const removeResult = await database.removeCoins(userId, bet, 'game_loss', 'Gamble loss');
      newBalance = removeResult.newBalance;
    }

    const rollDisplay = Math.floor(roll);
    const progressBar = '█'.repeat(Math.floor(rollDisplay / 10)) + '░'.repeat(10 - Math.floor(rollDisplay / 10));

    let headerText = multiplier > 0 ? `${emoji} 𝗬𝗢𝗨 𝗪𝗢𝗡! ${emoji}` : `${emoji} 𝗬𝗢𝗨 𝗟𝗢𝗦𝗧 ${emoji}`;
    
    let resultSection = '';
    if (multiplier > 0) {
      resultSection = `┌── 💰 𝗥𝗲𝘀𝘂𝗹𝘁𝘀 ──┐
│ 🏆 ${resultText}!
│ 💎 Multiplier: ${multiplier}x
│ 🎲 Bet: ${bet.toLocaleString()}
│ 💵 Winnings: ${winnings.toLocaleString()}
│ 📈 Profit: +${profit.toLocaleString()}
└────────────────────────────┘`;
    } else {
      resultSection = `┌── 💔 𝗥𝗲𝘀𝘂𝗹𝘁𝘀 ──┐
│ 😢 Better luck next time!
│ 🎲 Bet: ${bet.toLocaleString()}
│ 💸 Lost: -${bet.toLocaleString()}
└────────────────────────────┘`;
    }

    await reply(`┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     ${headerText}     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┌── 🎯 𝗥𝗼𝗹𝗹 ──┐
│ [${progressBar}] ${rollDisplay}%
└────────────────────┘

${resultSection}

┌── 🏦 𝗕𝗮𝗹𝗮𝗻𝗰𝗲 ──┐
│ 💰 ${newBalance.toLocaleString()} coins
└────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🍀 ${multiplier > 0 ? 'Nice! Try again?' : 'Gamble responsibly!'}`);
  },
};
