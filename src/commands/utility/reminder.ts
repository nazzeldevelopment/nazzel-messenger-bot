import type { Command, CommandContext } from '../../types/index.js';
import fmt, { decorations } from '../../lib/messageFormatter.js';

const command: Command = {
  name: 'reminder',
  aliases: ['remindme', 'timer', 'alarm'],
  description: 'Set a reminder that will ping you after specified time',
  category: 'utility',
  usage: 'reminder <time> <message>',
  examples: ['reminder 5m Drink water', 'reminder 1h Take a break', 'reminder 30s Check food'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, event, api } = context;
    const currentTime = fmt.formatTimestamp();
    
    if (args.length < 2) {
      await reply(`${decorations.alarm}${decorations.gear} 『 REMINDER 』 ${decorations.gear}${decorations.alarm}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Please provide time and message!

${decorations.bulb} FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
reminder <time> <message>

⏱️ TIME EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• 30s - 30 seconds
• 5m - 5 minutes
• 1h - 1 hour

📝 USAGE EXAMPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• reminder 5m Drink water
• reminder 1h Meeting time
• reminder 30s Check timer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      return;
    }
    
    const timeStr = args[0].toLowerCase();
    const message = args.slice(1).join(' ');
    
    let seconds = 0;
    const match = timeStr.match(/^(\d+)(s|m|h)$/);
    
    if (!match) {
      await reply(`${decorations.fire} 『 ERROR 』 ${decorations.fire}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Invalid time format!

Use: 30s, 5m, or 1h
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      return;
    }
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    if (unit === 's') seconds = value;
    else if (unit === 'm') seconds = value * 60;
    else if (unit === 'h') seconds = value * 3600;
    
    if (seconds > 86400) {
      await reply(`${decorations.fire} 『 ERROR 』 ${decorations.fire}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Maximum reminder time is 24 hours!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      return;
    }
    
    if (seconds < 10) {
      await reply(`${decorations.fire} 『 ERROR 』 ${decorations.fire}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Minimum reminder time is 10 seconds!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      return;
    }
    
    const triggerTime = new Date(Date.now() + seconds * 1000);
    const triggerTimeStr = triggerTime.toLocaleString('en-PH', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Manila'
    });
    
    await reply(`${decorations.alarm}${decorations.sparkle} 『 REMINDER SET 』 ${decorations.sparkle}${decorations.alarm}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${decorations.bell} REMINDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 Message: ${message}
⏱️ Time: ${timeStr} (${fmt.formatDuration(seconds * 1000)})
🔔 Trigger: ${triggerTimeStr}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ I'll remind you soon!
${decorations.sun} ${currentTime}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    setTimeout(async () => {
      try {
        await api.sendMessage(
          `${decorations.bell}${decorations.alarm} 『 REMINDER 』 ${decorations.alarm}${decorations.bell}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏰ Time's up!

${decorations.megaphone} MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔔 Set ${timeStr} ago
${decorations.sun} ${fmt.formatTimestamp()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
          event.threadID,
          undefined,
          event.messageID
        );
      } catch (error) {
        console.error('Failed to send reminder:', error);
      }
    }, seconds * 1000);
  }
};

export default command;
