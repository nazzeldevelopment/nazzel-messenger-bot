import type { Command, CommandContext } from '../../types/index.js';
import { decorations } from '../../lib/messageFormatter.js';

const command: Command = {
  name: 'love',
  aliases: ['lovecalc', 'lovemeter', 'loverate'],
  description: 'Calculate love percentage between two people',
  category: 'fun',
  usage: 'love <name1> <name2>',
  examples: ['love John Jane', 'love @user1 @user2'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { api, event, args, reply, prefix } = context;

    let name1 = '';
    let name2 = '';

    const mentions = event.mentions ? Object.keys(event.mentions) : [];

    if (mentions.length >= 2) {
      try {
        const userInfo = await api.getUserInfo(mentions);
        name1 = userInfo[mentions[0]]?.name || 'Person 1';
        name2 = userInfo[mentions[1]]?.name || 'Person 2';
      } catch {
        name1 = 'Person 1';
        name2 = 'Person 2';
      }
    } else if (args.length >= 2) {
      name1 = args[0];
      name2 = args.slice(1).join(' ');
    } else {
      await reply(`💕 『 LOVE CALCULATOR 』 💕
═══════════════════════════
${decorations.sparkle} Calculate your love!
═══════════════════════════

◈ USAGE
═══════════════════════════
➤ ${prefix}love <name1> <name2>
➤ ${prefix}love @user1 @user2

◈ EXAMPLE
═══════════════════════════
➤ ${prefix}love John Jane`);
      return;
    }

    const combined = (name1 + name2).toLowerCase();
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash) + combined.charCodeAt(i);
      hash = hash & hash;
    }
    const lovePercentage = Math.abs(hash % 101);

    let message = '';
    let emoji = '';
    let color = '';

    if (lovePercentage >= 90) {
      emoji = '💖';
      color = '🟣';
      message = 'Perfect match! Soulmates!';
    } else if (lovePercentage >= 70) {
      emoji = '💕';
      color = '🔵';
      message = 'Strong connection! Great!';
    } else if (lovePercentage >= 50) {
      emoji = '💗';
      color = '🟢';
      message = 'Good potential! Try it!';
    } else if (lovePercentage >= 30) {
      emoji = '💛';
      color = '🟡';
      message = 'Could work with effort!';
    } else {
      emoji = '💔';
      color = '🔴';
      message = 'Maybe just friends...';
    }

    const hearts = Math.round(lovePercentage / 10);
    const heartBar = '❤️'.repeat(hearts) + '🖤'.repeat(10 - hearts);

    await reply(`${emoji} 『 LOVE CALCULATOR 』 ${emoji}
═══════════════════════════

👤 ${name1}
     💘
👤 ${name2}

═══════════════════════════
${heartBar}
═══════════════════════════

${color} Love: ${lovePercentage}%
💬 ${message}

═══════════════════════════
${decorations.sparkle} Love is in the air!`);
  }
};

export default command;
