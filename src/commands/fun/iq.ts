import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'iq',
  aliases: ['iqtest', 'smartness'],
  description: 'Check someone\'s IQ (for fun)',
  category: 'fun',
  usage: 'iq [@mention]',
  examples: ['iq', 'iq @user'],

  async execute(context: CommandContext): Promise<void> {
    const { api, event, reply } = context;
    
    let targetId = ('' + event.senderID).trim();

    if (event.mentions && Object.keys(event.mentions).length > 0) {
      targetId = ('' + Object.keys(event.mentions)[0]).trim();
    } else if (event.messageReply) {
      targetId = ('' + event.messageReply.senderID).trim();
    }

    let targetName = 'You';
    try {
      const userInfo = await api.getUserInfo(targetId);
      targetName = userInfo[targetId]?.name || 'You';
    } catch {}

    const iq = Math.floor(Math.random() * 151) + 50;

    let verdict = '';
    let emoji = '';
    if (iq >= 180) {
      emoji = '🧠✨';
      verdict = 'Genius level! Smarter than Einstein!';
    } else if (iq >= 140) {
      emoji = '🎓';
      verdict = 'Gifted! Exceptionally intelligent!';
    } else if (iq >= 120) {
      emoji = '📚';
      verdict = 'Above average! Very smart!';
    } else if (iq >= 100) {
      emoji = '💡';
      verdict = 'Average intelligence. Normal and healthy!';
    } else if (iq >= 80) {
      emoji = '🤔';
      verdict = 'Below average... but still trying!';
    } else {
      emoji = '🥔';
      verdict = 'Potato IQ... but hey, potatoes are great!';
    }

    await reply(`${emoji} *IQ Test Result* ${emoji}\n\n👤 ${targetName}\n\n📊 IQ Score: ${iq}\n\n${verdict}\n\n*This is just for fun, not a real IQ test!*`);
  }
};

export default command;
