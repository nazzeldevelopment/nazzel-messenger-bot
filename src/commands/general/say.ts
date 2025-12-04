import type { Command, CommandContext } from '../../types/index.js';
import { decorations } from '../../lib/messageFormatter.js';

const command: Command = {
  name: 'say',
  aliases: ['echo', 'repeat'],
  description: 'Make the bot say something',
  category: 'general',
  usage: 'say <message>',
  examples: ['say Hello World!', 'say How are you?'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;
    
    if (args.length === 0) {
      await reply(`${decorations.sparkle} 『 SAY 』
━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Make me say something!

◈ USAGE
━━━━━━━━━━━━━━━━━━━━━━━━━
➤ ${prefix}say <your message>

◈ EXAMPLE
━━━━━━━━━━━━━━━━━━━━━━━━━
➤ ${prefix}say Hello everyone!`);
      return;
    }
    
    const message = args.join(' ');
    
    if (message.length > 2000) {
      await reply(`${decorations.fire} 『 ERROR 』
━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Message too long!
📝 Max: 2000 characters`);
      return;
    }
    
    await reply(`💬 ${message}`);
  }
};

export default command;
