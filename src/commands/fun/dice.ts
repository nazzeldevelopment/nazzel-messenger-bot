import type { Command, CommandContext } from '../../types/index.js';
import { decorations } from '../../lib/messageFormatter.js';

const diceEmojis: { [key: number]: string } = {
  1: '⚀',
  2: '⚁',
  3: '⚂',
  4: '⚃',
  5: '⚄',
  6: '⚅',
};

const command: Command = {
  name: 'dice',
  aliases: ['roll', 'd', 'rolldice'],
  description: 'Roll a dice (default d6, or custom sides)',
  category: 'fun',
  usage: 'dice [sides]',
  examples: ['dice', 'dice 20', 'dice 100'],
  cooldown: 3000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;
    
    const sides = Math.min(Math.max(parseInt(args[0]) || 6, 2), 100);
    const result = Math.floor(Math.random() * sides) + 1;
    
    const displayEmoji = sides === 6 ? diceEmojis[result] : '🎲';
    
    const resultColor = result === sides ? '🟢 MAX!' : 
                        result === 1 ? '🔴 MIN!' : 
                        result > sides * 0.7 ? '🟡 HIGH' : 
                        result < sides * 0.3 ? '🟠 LOW' : '🔵 MID';
    
    await reply(`🎲 『 DICE ROLL 』 🎲
═══════════════════════════
${decorations.sparkle} Rolling d${sides}...
═══════════════════════════

    ${displayEmoji}
    ↺ rolling...

═══════════════════════════
🎯 Result: ${result}
📊 Range: 1-${sides}
${resultColor}
═══════════════════════════
${decorations.star} Luck be with you!`);
  }
};

export default command;
