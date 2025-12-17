import type { Command, CommandContext } from '../../types/index.js';
import { safeGetUserInfo } from '../../lib/apiHelpers.js';
import fmt, { decorations } from '../../lib/messageFormatter.js';

const affirmations = [
  { text: "You are capable of achieving amazing things!", emoji: "🌟" },
  { text: "Your potential is limitless!", emoji: "🚀" },
  { text: "You bring light wherever you go!", emoji: "☀️" },
  { text: "You are worthy of love and happiness!", emoji: "💖" },
  { text: "Your kindness makes the world better!", emoji: "🌈" },
  { text: "You are stronger than you think!", emoji: "💪" },
  { text: "Your dreams are valid and achievable!", emoji: "✨" },
  { text: "You matter and your voice is important!", emoji: "🎤" },
  { text: "Today is full of possibilities for you!", emoji: "🌅" },
  { text: "You are enough, exactly as you are!", emoji: "💫" },
  { text: "Your journey is unique and beautiful!", emoji: "🦋" },
  { text: "You have the power to create change!", emoji: "⚡" },
  { text: "Your smile can brighten someone's day!", emoji: "😊" },
  { text: "You are a masterpiece in progress!", emoji: "🎨" },
  { text: "Every step you take matters!", emoji: "👣" },
  { text: "You are surrounded by love!", emoji: "💝" },
  { text: "Your best days are ahead of you!", emoji: "🌠" },
  { text: "You inspire others just by being you!", emoji: "🌻" },
  { text: "You have unlimited potential!", emoji: "🔥" },
  { text: "The universe is cheering for you!", emoji: "🎉" }
];

const command: Command = {
  name: 'affirmation',
  aliases: ['affirm', 'motivate', 'inspire', 'positivity'],
  description: 'Get a positive affirmation to brighten your day',
  category: 'fun',
  usage: 'affirmation',
  examples: ['affirmation'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { reply, event, api } = context;
    const currentTime = fmt.formatTimestamp();
    
    let userName = 'Friend';
    try {
      const userInfo = await safeGetUserInfo(api, event.senderID);
      userName = userInfo[event.senderID]?.name?.split(' ')[0] || 'Friend';
    } catch (e) {}
    
    const affirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    
    await reply(`${decorations.sparkle}${decorations.heart} 『 AFFIRMATION 』 ${decorations.heart}${decorations.sparkle}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${decorations.flower} Dear ${userName},
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${affirmation.emoji} ${affirmation.text}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${decorations.heart} Spread positivity today!
${decorations.sun} ${currentTime}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  }
};

export default command;
