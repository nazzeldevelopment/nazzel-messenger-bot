import type { Command, CommandContext } from '../../types/index.js';
import { safeGetUserInfo } from '../../lib/apiHelpers.js';

const fortunes = [
  "A beautiful, smart, and loving person will be coming into your life.",
  "A dubious friend may be an enemy in camouflage.",
  "A faithful friend is a strong defense.",
  "A fresh start will put you on your way.",
  "A golden egg of opportunity falls into your lap this month.",
  "A good time to finish up old tasks.",
  "A hunch is creativity trying to tell you something.",
  "A lifetime of happiness lies ahead of you.",
  "A light heart carries you through all the hard times.",
  "A new perspective will come with the new year.",
  "Accept something that you cannot change, and you will feel better.",
  "Adventure can be real happiness.",
  "All your hard work will soon pay off.",
  "An important person will offer you support.",
  "Be careful or you could fall for some tricks today.",
  "Believe in yourself and others will too.",
  "Better days are just around the corner.",
  "Don't be afraid to take that big step.",
  "Embrace this love relationship you have!",
  "Every flower blooms in its own time.",
  "Fortune smiles upon you today.",
  "Good things come to those who wait.",
  "Happiness is not a destination, it's a journey.",
  "Keep your eyes open. You never know what you might see.",
  "Love is on its way.",
  "New ideas could be profitable.",
  "Now is the time to try something new.",
  "Others look up to you.",
  "Practice makes perfect.",
  "Success is in your future.",
  "The best is yet to come.",
  "The one you love is closer than you think.",
  "Today is your lucky day!",
  "Tomorrow brings new opportunities.",
  "Trust your intuition.",
  "Your ability to find the good in others will help you succeed.",
  "Your heart will always make itself known through your words.",
  "Your kindness will lead you to success.",
  "Your life will be happy and peaceful.",
  "Your talents will be recognized and rewarded.",
];

const command: Command = {
  name: 'fortune',
  aliases: ['cookie', 'fortunecookie'],
  description: 'Get your fortune cookie message',
  category: 'fun',
  usage: 'fortune',
  examples: ['fortune'],

  async execute(context: CommandContext): Promise<void> {
    const { reply, event, api } = context;
    const senderId = event.senderID;
    
    let userName = 'Friend';
    try {
      const userInfo = await safeGetUserInfo(api, senderId);
      userName = userInfo[senderId]?.name?.split(' ')[0] || 'Friend';
    } catch (e) {}
    
    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    const luckyNumbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 49) + 1);
    
    await reply(`
╔══════════════════════════════════════╗
║      FORTUNE COOKIE             ║
╠══════════════════════════════════════╣
║                                      ║
║  Dear ${userName},                    ║
║                                      ║
║  "${fortune}"
║                                      ║
╠══════════════════════════════════════╣
║  Lucky Numbers: ${luckyNumbers.join(', ')}
╚══════════════════════════════════════╝`);
  },
};

export default command;
