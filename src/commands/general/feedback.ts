import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';

const command: Command = {
  name: 'feedback',
  aliases: ['suggest', 'suggestion', 'idea'],
  description: 'Send feedback or suggestions to developers',
  category: 'general',
  usage: 'feedback <message>',
  examples: ['feedback Add more games please!', 'feedback The bot is amazing!'],
  cooldown: 60000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, event, prefix } = context;

    if (args.length === 0) {
      await reply(`╭─────────────────╮
│ 💬 FEEDBACK
╰─────────────────╯

Share your ideas with us!

Usage: ${prefix}feedback <message>

Example:
${prefix}feedback Add more fun games!`);
      return;
    }

    const feedback = args.join(' ');
    const userId = event.senderID;

    BotLogger.info(`Feedback from ${userId}: ${feedback}`);

    await reply(`╭─────────────────╮
│ ✅ SENT!
╰─────────────────╯

Thank you for your feedback!
Your suggestion has been logged.

We appreciate your input! 💝`);
  }
};

export default command;
