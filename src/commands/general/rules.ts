import type { Command } from '../../types/index.js';

const defaultRules = [
  'Be respectful to all members.',
  'No spamming or flooding the chat.',
  'No inappropriate content or NSFW.',
  'No harassment or bullying.',
  'Follow Facebook Community Standards.',
  'Do not abuse bot commands.',
  'Keep conversations friendly and civil.',
  'No advertising without permission.',
  'Report issues to admins, not in chat.',
  'Have fun and enjoy the community!',
];

export const command: Command = {
  name: 'rules',
  aliases: ['rule', 'guidelines'],
  description: 'Show the group rules',
  category: 'general',
  usage: 'rules',
  examples: ['rules'],
  cooldown: 10,

  async execute({ reply }) {
    let message = `📜 *Group Rules*\n\n`;

    defaultRules.forEach((rule, index) => {
      message += `${index + 1}. ${rule}\n`;
    });

    message += `\n⚠️ Violating these rules may result in removal from the group.`;

    await reply(message);
  },
};
