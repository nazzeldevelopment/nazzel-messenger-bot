import type { Command, CommandContext } from '../../types/index.js';
import { database } from '../../database/index.js';

const command: Command = {
  name: 'userinfo',
  aliases: ['ui', 'user', 'whois'],
  description: 'Get detailed information about a user',
  category: 'utility',
  usage: 'userinfo [@user]',
  examples: ['userinfo', 'userinfo @someone'],

  async execute(context: CommandContext): Promise<void> {
    const { reply, event, api } = context;
    
    let targetId = event.senderID;
    
    if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = Object.keys(event.mentions)[0];
    } else if (event.messageReply?.senderID) {
      targetId = event.messageReply.senderID;
    }
    
    try {
      const userInfo = await api.getUserInfo(targetId);
      const user = userInfo[targetId];
      
      if (!user) {
        await reply('Could not find information about this user.');
        return;
      }
      
      const dbUser = await database.getUser(targetId);
      
      const name = user.name || 'Unknown';
      const gender = user.gender === 1 ? 'Female' : user.gender === 2 ? 'Male' : 'Not specified';
      const vanity = user.vanity || 'None';
      const isFriend = user.isFriend ? 'Yes' : 'No';
      const isBirthday = user.isBirthday ? 'Yes' : 'No';
      
      const level = dbUser?.level || 0;
      const xp = dbUser?.xp || 0;
      const totalMessages = dbUser?.totalMessages || 0;
      const joinedAt = dbUser?.joinedAt 
        ? new Date(dbUser.joinedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'Unknown';
      
      await reply(`
╔══════════════════════════════════════════════╗
║                                              ║
║            USER INFORMATION                 ║
║                                              ║
╠══════════════════════════════════════════════╣
║  PROFILE                                    ║
╠══════════════════════════════════════════════╣
║                                              ║
║  Name: ${name}
║  User ID: ${targetId}
║  Gender: ${gender}
║  Username: ${vanity}
║  Is Friend: ${isFriend}
║  Birthday Today: ${isBirthday}
║                                              ║
╠══════════════════════════════════════════════╣
║  BOT STATS                                  ║
╠══════════════════════════════════════════════╣
║                                              ║
║  Level: ${level}
║  XP: ${xp}
║  Total Messages: ${totalMessages}
║  First Seen: ${joinedAt}
║                                              ║
╚══════════════════════════════════════════════╝`);
    } catch (error) {
      await reply('Failed to get user information. Please try again.');
    }
  },
};

export default command;
