import type { Command, CommandContext } from '../../types/index.js';
import { BotLogger } from '../../lib/logger.js';

const command: Command = {
  name: 'addmember',
  aliases: ['add', 'invite'],
  description: 'Add member(s) to the group using profile link or user ID',
  category: 'admin',
  usage: 'addmember <profile_link|userID> [more...]',
  examples: [
    'addmember https://facebook.com/profile.php?id=123456789',
    'addmember 123456789',
    'addmember 123456789 987654321'
  ],
  adminOnly: true,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, args, reply } = context;
    
    if (args.length === 0) {
      await reply('❌ Please provide user ID(s) or profile link(s) to add.\nUsage: addmember <profile_link|userID>');
      return;
    }
    
    const userIds: string[] = [];
    
    for (const arg of args) {
      const userId = extractUserId(arg);
      if (userId) {
        userIds.push(userId);
      }
    }
    
    if (userIds.length === 0) {
      await reply('❌ No valid user IDs found. Please provide valid profile links or user IDs.');
      return;
    }
    
    const results: { success: string[]; failed: string[] } = { success: [], failed: [] };
    
    await reply(`🔄 Adding ${userIds.length} member(s)...`);
    
    const threadId = String(event.threadID);
    for (const userId of userIds) {
      try {
        await new Promise<void>((resolve, reject) => {
          api.addUserToGroup(String(userId), threadId, (err: Error | null) => {
            if (err) reject(err);
            else resolve();
          });
        });
        results.success.push(userId);
        BotLogger.info(`Added user ${userId} to group ${threadId}`);
      } catch (error) {
        results.failed.push(userId);
        BotLogger.error(`Failed to add user ${userId}`, error);
      }
    }
    
    let response = `╔═══════════════════════════════╗\n`;
    response += `║ 👥 ADD MEMBER RESULTS\n`;
    response += `╠═══════════════════════════════╣\n`;
    
    if (results.success.length > 0) {
      response += `║ ✅ Successfully added: ${results.success.length}\n`;
      for (const id of results.success) {
        response += `║    • ${id}\n`;
      }
    }
    
    if (results.failed.length > 0) {
      response += `║ ❌ Failed to add: ${results.failed.length}\n`;
      for (const id of results.failed) {
        response += `║    • ${id}\n`;
      }
    }
    
    response += `╚═══════════════════════════════╝`;
    
    await reply(response);
  }
};

function extractUserId(input: string): string | null {
  if (/^\d+$/.test(input)) {
    return input;
  }
  
  const patterns = [
    /facebook\.com\/profile\.php\?id=(\d+)/,
    /facebook\.com\/(\d+)/,
    /fb\.com\/(\d+)/,
    /id=(\d+)/,
  ];
  
  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

export default command;
