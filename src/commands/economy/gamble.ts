import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';

export const command: Command = {
  name: 'gamble',
  aliases: ['bet', 'risk', 'allin'],
  description: 'Gamble your coins with varying odds',
  category: 'economy',
  usage: 'gamble <bet>',
  examples: ['gamble 100', 'gamble 500'],
  cooldown: 8000,

  async execute({ api, event, args, reply, prefix }) {
    const userId = ('' + event.senderID).trim();
    const bet = parseInt(args[0], 10);

    if (!args[0] || isNaN(bet) || bet < 10) {
      await reply(`╭───────────────────╮
│   🎲 GAMBLE      │
╰───────────────────╯
📌 ${prefix}gamble <bet>
💵 Min: 10 coins

╭─ Chances ─╮
│ 45% = 2x  │
│ 20% = 3x  │
│ 10% = 5x  │
│ 5% = 10x  │
│ 20% = 0x  │
╰──────────╯`);
      return;
    }

    if (bet > 50000) {
      await reply(`❌ Max bet: 50,000 coins`);
      return;
    }

    const currentCoins = await database.getUserCoins(userId);
    if (currentCoins < bet) {
      await reply(`╭───────────────────╮
│   💸 NO COINS    │
╰───────────────────╯
💰 Have: ${currentCoins.toLocaleString()}
💵 Bet: ${bet.toLocaleString()}`);
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

    if (multiplier > 0) {
      const profit = winnings - bet;
      const addResult = await database.addCoins(userId, profit, 'game_win', `Gamble win (${multiplier}x)`);
      newBalance = addResult.newBalance;
    } else {
      const removeResult = await database.removeCoins(userId, bet, 'game_loss', 'Gamble loss');
      newBalance = removeResult.newBalance;
    }

    const rollDisplay = Math.floor(roll);

    await reply(`╭───────────────────╮
│   🎲 GAMBLE ${emoji}   │
╰───────────────────╯
🎯 Roll: ${rollDisplay}/100

${multiplier > 0 
  ? `${resultText}! ${multiplier}x
💰 +${winnings.toLocaleString()}` 
  : `${resultText}
💔 -${bet.toLocaleString()}`}
💵 Bal: ${newBalance.toLocaleString()}`);
  },
};
