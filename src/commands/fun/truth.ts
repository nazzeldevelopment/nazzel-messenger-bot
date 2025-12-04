import type { Command, CommandContext } from '../../types/index.js';

const truths = [
  "What's the most embarrassing thing you've ever done?",
  "Who was your first crush?",
  "What's your biggest secret?",
  "Have you ever lied to your best friend?",
  "What's the worst thing you've ever said about someone behind their back?",
  "What's your biggest fear?",
  "Who do you have a crush on right now?",
  "What's the most childish thing you still do?",
  "Have you ever stolen something?",
  "What's the last lie you told?",
  "What's your most embarrassing moment in school?",
  "Have you ever cheated on a test?",
  "What's the meanest thing you've ever done?",
  "Who in this group chat annoys you the most?",
  "What's your biggest insecurity?",
  "Have you ever had a crush on a friend's partner?",
  "What's the worst date you've ever been on?",
  "What's something you've never told anyone?",
  "Who do you secretly admire?",
  "What's the most embarrassing thing in your search history?",
  "Have you ever pretended to be sick to skip something?",
  "What's your guilty pleasure?",
  "Who in this group would you want to be stuck on an island with?",
  "What's the worst gift you've ever received?",
  "Have you ever broken someone's heart?",
  "What's the craziest thing you've done for love?",
  "Who was the last person you stalked on social media?",
  "What's your most unpopular opinion?",
  "Have you ever had a dream about someone in this chat?",
  "What's the most trouble you've ever been in?",
];

const command: Command = {
  name: 'truth',
  aliases: ['t'],
  description: 'Get a random truth question',
  category: 'fun',
  usage: 'truth',
  examples: ['truth'],

  async execute(context: CommandContext): Promise<void> {
    const { reply, event, api } = context;
    const senderId = event.senderID;
    
    let userName = 'Truth Seeker';
    try {
      const userInfo = await api.getUserInfo(senderId);
      userName = userInfo[senderId]?.name?.split(' ')[0] || 'Truth Seeker';
    } catch (e) {}
    
    const truth = truths[Math.floor(Math.random() * truths.length)];
    
    await reply(`
╔══════════════════════════════════════╗
║         TRUTH TIME              ║
╠══════════════════════════════════════╣
║                                      ║
║  ${userName}, answer honestly!       ║
║                                      ║
╠══════════════════════════════════════╣
║                                      ║
║  ${truth}
║                                      ║
╠══════════════════════════════════════╣
║                                      ║
║  Remember, honesty is the best     ║
║  policy!                            ║
║                                      ║
╚══════════════════════════════════════╝`);
  },
};

export default command;
