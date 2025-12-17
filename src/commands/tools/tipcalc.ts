import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'tipcalc',
  aliases: ['tip', 'tipscalc', 'gratuity'],
  description: 'Calculate tip amount',
  category: 'tools',
  usage: 'tipcalc <bill> [percent]',
  examples: ['tipcalc 100', 'tipcalc 500 20'],
  cooldown: 3000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length === 0) {
      await reply(`╭─────────────────╮
│ 💸 TIP CALC
╰─────────────────╯

Usage: ${prefix}tipcalc <bill> [percent]
Default tip: 15%

Example: ${prefix}tipcalc 500 20`);
      return;
    }

    const bill = parseFloat(args[0]);
    const tipPercent = parseFloat(args[1]) || 15;

    if (isNaN(bill)) {
      await reply(`❌ Please enter a valid bill amount!`);
      return;
    }

    const tip = bill * (tipPercent / 100);
    const total = bill + tip;

    await reply(`╭─────────────────╮
│ 💸 TIP CALC
╰─────────────────╯

📋 Bill: ₱${bill.toFixed(2)}
💵 Tip (${tipPercent}%): ₱${tip.toFixed(2)}

✨ Total: ₱${total.toFixed(2)}`);
  }
};

export default command;
