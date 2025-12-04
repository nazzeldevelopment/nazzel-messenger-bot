import type { Command, CommandContext } from '../../types/index.js';
import { decorations } from '../../lib/messageFormatter.js';

const command: Command = {
  name: 'coin',
  aliases: ['coinflip', 'toss', 'flipcoin'],
  description: 'Flip a coin - heads or tails?',
  category: 'fun',
  usage: 'coin',
  examples: ['coin'],
  cooldown: 3000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    
    const isHeads = Math.random() < 0.5;
    const result = isHeads ? 'HEADS' : 'TAILS';
    const emoji = isHeads ? '👑' : '🦅';
    const color = isHeads ? '🟡' : '🟠';
    
    await reply(`🪙 『 COIN FLIP 』 🪙
═══════════════════════════
${decorations.sparkle} Flipping the coin...
═══════════════════════════

       🪙
    ↺ spinning...

═══════════════════════════
${color} Result: ${emoji} ${result}!
═══════════════════════════
${decorations.star} The coin has landed!`);
  }
};

export default command;
