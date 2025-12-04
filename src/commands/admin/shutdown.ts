import type { Command, CommandContext } from '../../types/index.js';
import fmt, { decorations } from '../../lib/messageFormatter.js';

const command: Command = {
  name: 'shutdown',
  aliases: ['die', 'stop'],
  description: 'Shutdown the bot gracefully (Owner only)',
  category: 'admin',
  usage: 'shutdown',
  examples: ['shutdown'],
  cooldown: 30000,
  ownerOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    const currentTime = fmt.formatTimestamp();
    
    await reply(`${decorations.fire}${decorations.shield} 『 SHUTDOWN 』 ${decorations.shield}${decorations.fire}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${decorations.lightning} SYSTEM STATUS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Initiating graceful shutdown...
🔌 Disconnecting services...
💾 Saving state...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.moon} Goodbye! Bot shutting down...
${decorations.sun} ${currentTime}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    setTimeout(() => {
      process.exit(0);
    }, 3000);
  }
};

export default command;
