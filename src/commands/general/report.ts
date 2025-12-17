import type { Command } from '../../types/index.js';
import { database } from '../../database/index.js';

export const command: Command = {
  name: 'report',
  aliases: ['bug', 'feedback'],
  description: 'Report a bug or send feedback',
  category: 'general',
  usage: 'report <message>',
  examples: ['report Command X is not working'],
  cooldown: 60000,
  async execute({ reply, args, event }) {
    if (!args.length) return reply('❌ Please provide your report/feedback!');
    
    const message = args.join(' ');
    
    await database.logEntry({
      type: 'report',
      level: 'info',
      message: message,
      userId: event.senderID,
      threadId: event.threadID,
    });
    
    await reply(`📩 REPORT SENT\n\nThank you for your feedback!\n\n"${message.substring(0, 100)}..."\n\nThe owner will review this soon.`);
  },
};
