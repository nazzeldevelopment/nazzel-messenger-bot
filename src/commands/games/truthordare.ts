import type { Command } from '../../types/index.js';
const truths = ["What's your biggest fear?", "What's your most embarrassing moment?", "Who's your secret crush?", "What's a lie you've told?", "What's your biggest regret?"];
const dares = ["Send a selfie", "Sing a song", "Do 10 pushups", "Dance for 30 seconds", "Call someone random"];
export const command: Command = { name: 'truthordare', aliases: ['tod', 'tord'], description: 'Truth or Dare', category: 'games', usage: 'truthordare <truth/dare>', examples: ['truthordare truth'], cooldown: 5000,
  async execute({ reply, args }) {
    const choice = args[0]?.toLowerCase();
    if (choice === 'truth') await reply(`❓ TRUTH\n\n${truths[Math.floor(Math.random() * truths.length)]}`);
    else if (choice === 'dare') await reply(`🔥 DARE\n\n${dares[Math.floor(Math.random() * dares.length)]}`);
    else await reply('❌ Choose: truthordare truth OR truthordare dare');
  },
};
