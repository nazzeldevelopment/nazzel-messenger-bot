import type { Command, CommandContext } from '../../types/index.js';
import { decorations } from '../../lib/messageFormatter.js';

const responses = {
  positive: [
    'It is certain',
    'It is decidedly so',
    'Without a doubt',
    'Yes, definitely',
    'You may rely on it',
    'As I see it, yes',
    'Most likely',
    'Outlook good',
    'Yes',
    'Signs point to yes',
  ],
  neutral: [
    'Reply hazy, try again',
    'Ask again later',
    'Better not tell you now',
    'Cannot predict now',
    'Concentrate and ask again',
  ],
  negative: [
    'Don\'t count on it',
    'My reply is no',
    'My sources say no',
    'Outlook not so good',
    'Very doubtful',
  ],
};

const command: Command = {
  name: '8ball',
  aliases: ['ask', 'magic', 'fortune'],
  description: 'Ask the magic 8-ball a question',
  category: 'fun',
  usage: '8ball <question>',
  examples: ['8ball Will I be rich?', '8ball Should I go out today?'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;
    
    if (args.length === 0) {
      await reply(`🎱 『 MAGIC 8-BALL 』 🎱
═══════════════════════════
${decorations.sparkle} Ask me anything!
═══════════════════════════

◈ USAGE
═══════════════════════════
➤ ${prefix}8ball <your question>

◈ EXAMPLE
═══════════════════════════
➤ ${prefix}8ball Will I be lucky?`);
      return;
    }
    
    const question = args.join(' ');
    const category = Math.random();
    let response: string;
    let color: string;
    
    if (category < 0.5) {
      response = responses.positive[Math.floor(Math.random() * responses.positive.length)];
      color = '🟢';
    } else if (category < 0.75) {
      response = responses.neutral[Math.floor(Math.random() * responses.neutral.length)];
      color = '🟡';
    } else {
      response = responses.negative[Math.floor(Math.random() * responses.negative.length)];
      color = '🔴';
    }
    
    await reply(`🎱 『 MAGIC 8-BALL 』 🎱
═══════════════════════════

❓ Question:
"${question}"

═══════════════════════════

${color} Answer:
✨ ${response}

═══════════════════════════
${decorations.sparkle} The ball has spoken!`);
  }
};

export default command;
