import type { Command, CommandContext } from '../../types/index.js';
import { decorations } from '../../lib/messageFormatter.js';

const command: Command = {
  name: 'choose',
  aliases: ['pick', 'decide', 'random'],
  description: 'Choose randomly between options',
  category: 'fun',
  usage: 'choose <option1> | <option2> | ...',
  examples: ['choose pizza | burger | sushi', 'choose yes | no'],
  cooldown: 3000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;
    
    const input = args.join(' ');
    const options = input.split('|').map(opt => opt.trim()).filter(opt => opt.length > 0);
    
    if (options.length < 2) {
      await reply(`🎯 『 CHOOSER 』 🎯
═══════════════════════════
${decorations.sparkle} Let me decide for you!
═══════════════════════════

◈ USAGE
═══════════════════════════
➤ ${prefix}choose opt1 | opt2 | opt3

◈ EXAMPLE
═══════════════════════════
➤ ${prefix}choose pizza | burger | sushi
➤ ${prefix}choose yes | no | maybe`);
      return;
    }
    
    const choice = options[Math.floor(Math.random() * options.length)];
    
    await reply(`🎯 『 DECISION MADE 』 🎯
═══════════════════════════
${decorations.sparkle} Choosing from ${options.length} options...
═══════════════════════════

◈ OPTIONS
═══════════════════════════
${options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}

═══════════════════════════
✨ I choose: ${choice}
═══════════════════════════
${decorations.star} Decision made!`);
  }
};

export default command;
