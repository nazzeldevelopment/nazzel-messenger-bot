import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'love',
  aliases: ['lovecalc', 'lovemeter'],
  description: 'Calculate love percentage between two people',
  category: 'fun',
  usage: 'love <name1> <name2>',
  examples: ['love John Jane', 'love @user1 @user2'],

  async execute(context: CommandContext): Promise<void> {
    const { api, event, args, reply } = context;

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
      await reply('💕 Usage: N!love <name1> <name2>\n\nExample: N!love John Jane');
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

    if (lovePercentage >= 90) {
      emoji = '💖💖💖';
      message = 'Perfect match! Made for each other!';
    } else if (lovePercentage >= 70) {
      emoji = '💕💕';
      message = 'Strong connection! Great compatibility!';
    } else if (lovePercentage >= 50) {
      emoji = '💗';
      message = 'Good potential! Give it a chance!';
    } else if (lovePercentage >= 30) {
      emoji = '💛';
      message = 'Could work with some effort!';
    } else {
      emoji = '💔';
      message = 'Maybe just friends...';
    }

    const hearts = Math.round(lovePercentage / 10);
    const heartBar = '❤️'.repeat(hearts) + '🖤'.repeat(10 - hearts);

    await reply(`${emoji} *Love Calculator* ${emoji}\n\n👤 ${name1}\n💕\n👤 ${name2}\n\n${heartBar}\n\n💘 Love: ${lovePercentage}%\n\n${message}`);
  }
};

export default command;
