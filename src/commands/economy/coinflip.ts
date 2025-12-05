import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';

export const command: Command = {
  name: 'coinflip',
  aliases: ['cf', 'flip', 'headsortails'],
  description: 'Flip a coin and bet on the outcome',
  category: 'economy',
  usage: 'coinflip <heads|tails> <bet>',
  examples: ['coinflip heads 100', 'cf tails 500'],
  cooldown: 5000,

  async execute({ api, event, args, reply }) {
    const userId = ('' + event.senderID).trim();

    if (args.length < 2) {
      await reply(`🪙 COINFLIP
━━━━━━━━━━━━━━━
📌 N!coinflip <heads|tails> <bet>
💵 Minimum bet: 10 coins
🎲 Win = 2x your bet
━━━━━━━━━━━━━━━
Examples:
N!cf heads 100
N!cf tails 500`);
      return;
    }

    const choice = args[0].toLowerCase();
    const bet = parseInt(args[1], 10);

    if (choice !== 'heads' && choice !== 'tails' && choice !== 'h' && choice !== 't') {
      await reply(`❌ Choose 'heads' or 'tails'`);
      return;
    }

    const normalizedChoice = (choice === 'h' || choice === 'heads') ? 'heads' : 'tails';

    if (isNaN(bet) || bet < 10) {
      await reply(`❌ Minimum bet is 10 coins`);
      return;
    }

    if (bet > 10000) {
      await reply(`❌ Maximum bet is 10,000 coins`);
      return;
    }

    const currentCoins = await database.getUserCoins(userId);
    if (currentCoins < bet) {
      await reply(`❌ INSUFFICIENT BALANCE
━━━━━━━━━━━━━━━
💰 You have: ${currentCoins.toLocaleString()} coins
💵 Bet amount: ${bet.toLocaleString()} coins
━━━━━━━━━━━━━━━
📌 N!claim - Get daily coins`);
      return;
    }

    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const won = result === normalizedChoice;
    const winnings = won ? bet * 2 : 0;

    let newBalance = 0;
    if (won) {
      const addResult = await database.addCoins(userId, bet, 'game_win', 'Coinflip win');
      newBalance = addResult.newBalance;
    } else {
      const removeResult = await database.removeCoins(userId, bet, 'game_loss', 'Coinflip loss');
      newBalance = removeResult.newBalance;
    }

    const coinEmoji = result === 'heads' ? '🪙' : '💿';
    const resultEmoji = won ? '🎉' : '😢';

    await reply(`${coinEmoji} COINFLIP ${resultEmoji}
━━━━━━━━━━━━━━━
🎯 Your pick: ${normalizedChoice.toUpperCase()}
🪙 Result: ${result.toUpperCase()}
━━━━━━━━━━━━━━━
${won 
  ? `✅ You WON ${winnings.toLocaleString()} coins!` 
  : `❌ You lost ${bet.toLocaleString()} coins`}
💵 Balance: ${newBalance.toLocaleString()} coins
━━━━━━━━━━━━━━━`);
  },
};
