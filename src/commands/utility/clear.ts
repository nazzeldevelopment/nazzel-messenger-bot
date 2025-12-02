import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'clear',
  aliases: ['cls'],
  description: 'Send empty lines to "clear" the chat',
  category: 'utility',
  usage: 'clear',
  examples: ['clear'],
  adminOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    
    const clearMessage = '\n'.repeat(30) + '━━━━━━━━━━━━━━━━\n🧹 Chat Cleared\n━━━━━━━━━━━━━━━━';
    
    await reply(clearMessage);
  }
};

export default command;
