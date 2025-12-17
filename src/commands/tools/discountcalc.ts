import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'discount',
  aliases: ['discountcalc', 'sale', 'percentoff'],
  description: 'Calculate discount price',
  category: 'tools',
  usage: 'discount <price> <percent>',
  examples: ['discount 100 20', 'discount 500 50'],
  cooldown: 3000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length < 2) {
      await reply(`╭─────────────────╮
│ 🏷️ DISCOUNT
╰─────────────────╯

Usage: ${prefix}discount <price> <percent>

Example: ${prefix}discount 100 20`);
      return;
    }

    const price = parseFloat(args[0]);
    const percent = parseFloat(args[1]);

    if (isNaN(price) || isNaN(percent)) {
      await reply(`❌ Please enter valid numbers!`);
      return;
    }

    const discount = price * (percent / 100);
    const finalPrice = price - discount;

    await reply(`╭─────────────────╮
│ 🏷️ DISCOUNT
╰─────────────────╯

💵 Original: ₱${price.toFixed(2)}
📉 Discount: ${percent}%
💰 Savings: ₱${discount.toFixed(2)}

✨ Final: ₱${finalPrice.toFixed(2)}`);
  }
};

export default command;
