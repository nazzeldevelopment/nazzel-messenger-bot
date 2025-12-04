import type { Command } from '../../types/index.js';
import { decorations } from '../../lib/messageFormatter.js';

const defaultRules = [
  'Be respectful to all members',
  'No spamming or flooding the chat',
  'No inappropriate content or NSFW',
  'No harassment or bullying',
  'Follow Facebook Community Standards',
  'Do not abuse bot commands',
  'Keep conversations friendly and civil',
  'No advertising without permission',
  'Report issues to admins',
  'Have fun and enjoy the community!',
];

export const command: Command = {
  name: 'rules',
  aliases: ['rule', 'guidelines'],
  description: 'Show the group rules',
  category: 'general',
  usage: 'rules',
  examples: ['rules'],
  cooldown: 10000,

  async execute({ reply }) {
    const ruleEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    
    let msg = `${decorations.crown} 『 GROUP RULES 』 ${decorations.crown}
━━━━━━━━━━━━━━━━━━━━━━━━━
📜 Please follow these guidelines
━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

    defaultRules.forEach((rule, index) => {
      msg += `\n${ruleEmojis[index]} ${rule}`;
    });

    msg += `\n
━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ Violations may result in removal
${decorations.heart} Thanks for being awesome!`;

    await reply(msg);
  },
};
