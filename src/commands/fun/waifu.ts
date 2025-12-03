import type { Command, CommandContext } from '../../types/index.js';

const waifuNames = [
  'Sakura', 'Hinata', 'Mikasa', 'Zero Two', 'Rem', 'Emilia',
  'Nezuko', 'Megumin', 'Aqua', 'Asuna', 'Erza', 'Rias',
  'Tohru', 'Chika', 'Marin', 'Anya', 'Makima', 'Power',
];

const waifuTraits = [
  'cute and caring', 'strong and independent', 'mysterious and elegant',
  'energetic and cheerful', 'shy but sweet', 'cool and composed',
  'powerful and protective', 'playful and mischievous', 'kind and gentle',
];

const waifuRatings = ['S+', 'S', 'A+', 'A', 'B+', 'B', 'C'];

const command: Command = {
  name: 'waifu',
  aliases: ['randomwaifu'],
  description: 'Get a random waifu',
  category: 'fun',
  usage: 'waifu',
  examples: ['waifu'],

  async execute(context: CommandContext): Promise<void> {
    const { api, event, reply } = context;
    const senderId = ('' + event.senderID).trim();

    const name = waifuNames[Math.floor(Math.random() * waifuNames.length)];
    const trait = waifuTraits[Math.floor(Math.random() * waifuTraits.length)];
    const rating = waifuRatings[Math.floor(Math.random() * waifuRatings.length)];
    const compatibility = Math.floor(Math.random() * 51) + 50;

    let userName = 'You';
    try {
      const userInfo = await api.getUserInfo(senderId);
      userName = userInfo[senderId]?.name || 'You';
    } catch {}

    await reply(`💕 *Your Random Waifu* 💕\n\n👸 Name: ${name}\n✨ Trait: ${trait}\n⭐ Rating: ${rating}\n💘 Compatibility with ${userName}: ${compatibility}%\n\n${compatibility >= 80 ? '🎉 Perfect match!' : compatibility >= 60 ? '💗 Great potential!' : '💛 Could work with effort!'}`);
  }
};

export default command;
