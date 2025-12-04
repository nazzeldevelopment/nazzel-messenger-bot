import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'confess',
  aliases: ['confession', 'anon'],
  description: 'Send an anonymous confession to the group',
  category: 'fun',
  usage: 'confess <message>',
  examples: ['confess I secretly love pineapple pizza'],

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, api, event } = context;
    
    if (args.length === 0) {
      await reply('Please provide a confession message!\nUsage: confess <your message>');
      return;
    }
    
    const confession = args.join(' ');
    const confessionNumber = Math.floor(Math.random() * 9000) + 1000;
    
    try {
      await api.unsendMessage(event.messageID);
    } catch (e) {}
    
    await reply(`
╔══════════════════════════════════════╗
║      ANONYMOUS CONFESSION       ║
╠══════════════════════════════════════╣
║                                      ║
║  Confession #${confessionNumber}
║                                      ║
║  "${confession}"
║                                      ║
╠══════════════════════════════════════╣
║                                      ║
║  This confession was sent           ║
║  anonymously.                        ║
║                                      ║
╚══════════════════════════════════════╝`);
  },
};

export default command;
