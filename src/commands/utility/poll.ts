import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'poll',
  aliases: ['vote', 'survey'],
  description: 'Create a poll for the group',
  category: 'utility',
  usage: 'poll <question> | <option1> | <option2> | ...',
  examples: ['poll What should we eat? | Pizza | Burger | Sushi', 'poll Best anime? | Naruto | One Piece | Attack on Titan'],
  cooldown: 30,

  async execute({ args, reply }) {
    const input = args.join(' ');
    const parts = input.split('|').map(p => p.trim()).filter(p => p);

    if (parts.length < 3) {
      await reply(`📊 *Create a Poll*\n\nUsage: poll <question> | <option1> | <option2> | ...\n\nExample:\npoll What should we eat? | Pizza | Burger | Sushi\n\n• Separate question and options with |\n• Minimum 2 options required`);
      return;
    }

    const question = parts[0];
    const options = parts.slice(1);

    if (options.length > 10) {
      await reply('❌ Maximum 10 options allowed.');
      return;
    }

    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

    let pollMessage = `📊 *POLL*\n\n❓ ${question}\n\n`;
    
    options.forEach((opt, i) => {
      pollMessage += `${emojis[i]} ${opt}\n`;
    });

    pollMessage += `\n✅ React with the corresponding emoji to vote!\n⏰ Poll created just now`;

    await reply(pollMessage);
  },
};
