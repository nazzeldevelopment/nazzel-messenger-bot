import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';

const command: Command = {
  name: 'dicegame',
  aliases: ['rolldice', 'dg', 'dicebet'],
  description: 'Roll dice and bet on the outcome',
  category: 'economy',
  usage: 'dicegame <high/low/7> <amount>',
  examples: ['dicegame high 100', 'dicegame low 50', 'dicegame 7 200'],
  cooldown: 15000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, event, prefix } = context;
    const userId = event.senderID;

    if (args.length < 2) {
      await reply(`╭─────────────────╮
│ 🎲 DICE GAME
╰─────────────────╯

Usage: ${prefix}dicegame <bet> <amount>

Bets:
• high (8-12) - 2x payout
• low (2-6) - 2x payout
• 7 (exactly 7) - 5x payout`);
      return;
    }

    const bet = args[0].toLowerCase();
    const amount = parseInt(args[1]);

    if (!['high', 'low', '7'].includes(bet)) {
      await reply(`❌ Invalid bet! Use: high, low, or 7`);
      return;
    }

    if (isNaN(amount) || amount < 10) {
      await reply(`❌ Minimum bet is 10 coins!`);
      return;
    }

    const balance = await database.getUserCoins(userId);
    if (balance < amount) {
      await reply(`❌ Insufficient coins! Balance: ${balance}`);
      return;
    }

    await database.removeCoins(userId, amount, 'gambling', 'Dice game bet');

    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;

    let win = false;
    let multiplier = 0;

    if (bet === 'high' && total >= 8 && total <= 12) {
      win = true;
      multiplier = 2;
    } else if (bet === 'low' && total >= 2 && total <= 6) {
      win = true;
      multiplier = 2;
    } else if (bet === '7' && total === 7) {
      win = true;
      multiplier = 5;
    }

    const winnings = win ? amount * multiplier : 0;
    if (winnings > 0) {
      await database.addCoins(userId, winnings, 'gambling', 'Dice game win');
    }

    const newBalance = await database.getUserCoins(userId);

    await reply(`╭─────────────────╮
│ 🎲 DICE RESULT
╰─────────────────╯

🎲 ${dice1} + ${dice2} = ${total}
Bet: ${bet.toUpperCase()}

${win ? '✅ WIN!' : '❌ LOST'}
${win ? `💰 +${winnings.toLocaleString()}` : `💸 -${amount.toLocaleString()}`}
💳 Balance: ${newBalance.toLocaleString()}`);
  }
};

export default command;
