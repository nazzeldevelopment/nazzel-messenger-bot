import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';

const command: Command = {
  name: 'logs',
  aliases: ['log', 'history'],
  description: 'View recent bot logs',
  category: 'admin',
  usage: 'logs [type] [limit]',
  examples: ['logs', 'logs command 20', 'logs error 10'],
  ownerOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;
    
    const type = args[0]?.toLowerCase();
    const limit = parseInt(args[1]) || 20;
    
    const validTypes = ['command', 'error', 'debug', 'event', 'message', 'system'];
    
    if (type && !validTypes.includes(type)) {
      await reply(`❌ Invalid log type. Valid types: ${validTypes.join(', ')}`);
      return;
    }
    
    try {
      const logs = await database.getLogs({ type, limit });
      
      if (logs.length === 0) {
        await reply('📋 No logs found.');
        return;
      }
      
      let response = `╔═══════════════════════════════╗\n`;
      response += `║ 📋 RECENT LOGS ${type ? `(${type.toUpperCase()})` : ''}\n`;
      response += `╠═══════════════════════════════╣\n`;
      
      for (const log of logs.slice(0, 10)) {
        const time = new Date(log.timestamp).toLocaleTimeString();
        const levelEmoji = log.level === 'error' ? '🔴' : log.level === 'warn' ? '🟡' : '🟢';
        response += `║ ${levelEmoji} [${time}] ${log.type}\n`;
        response += `║    ${log.message.substring(0, 40)}${log.message.length > 40 ? '...' : ''}\n`;
      }
      
      response += `╠═══════════════════════════════╣\n`;
      response += `║ Showing ${Math.min(logs.length, 10)} of ${logs.length} logs\n`;
      response += `╚═══════════════════════════════╝`;
      
      await reply(response);
    } catch (error) {
      await reply('❌ Failed to fetch logs.');
    }
  }
};

export default command;
