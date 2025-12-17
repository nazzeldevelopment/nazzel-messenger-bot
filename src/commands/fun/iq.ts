import type { Command, CommandContext } from '../../types/index.js';
import { safeGetUserInfo } from '../../lib/apiHelpers.js';
import { decorations } from '../../lib/messageFormatter.js';

const command: Command = {
  name: 'iq',
  aliases: ['iqtest', 'smartness', 'brain'],
  description: 'Check someone\'s IQ (for fun only!)',
  category: 'fun',
  usage: 'iq [@mention]',
  examples: ['iq', 'iq @user'],
  cooldown: 5000,

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
      const userInfo = await safeGetUserInfo(api, targetId);
      targetName = userInfo[targetId]?.name || 'You';
    } catch {}

    const iq = Math.floor(Math.random() * 151) + 50;

    let verdict = '';
    let emoji = '';
    let color = '';
    let bar = '';
    
    const barLevel = Math.min(10, Math.floor(iq / 20));
    bar = '🧠'.repeat(barLevel) + '⬜'.repeat(10 - barLevel);
    
    if (iq >= 180) {
      emoji = '🧠✨';
      color = '🟣';
      verdict = 'Genius! Smarter than Einstein!';
    } else if (iq >= 140) {
      emoji = '🎓';
      color = '🔵';
      verdict = 'Gifted! Exceptionally smart!';
    } else if (iq >= 120) {
      emoji = '📚';
      color = '🟢';
      verdict = 'Above average! Very smart!';
    } else if (iq >= 100) {
      emoji = '💡';
      color = '🟢';
      verdict = 'Average! Normal and healthy!';
    } else if (iq >= 80) {
      emoji = '🤔';
      color = '🟡';
      verdict = 'Below average, but trying!';
    } else {
      emoji = '🥔';
      color = '🟠';
      verdict = 'Potato IQ... but potatoes are great!';
    }

    await reply(`${emoji} 『 IQ TEST 』 ${emoji}
═══════════════════════════
👤 ${targetName}
═══════════════════════════

${bar}

═══════════════════════════
📊 IQ Score: ${iq}
${color} ${verdict}
═══════════════════════════

${decorations.sparkle} Just for fun! Not a real test!`);
  }
};

export default command;
