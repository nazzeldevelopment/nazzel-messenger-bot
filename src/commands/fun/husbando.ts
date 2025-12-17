import type { Command, CommandContext } from '../../types/index.js';
import { safeGetUserInfo } from '../../lib/apiHelpers.js';

const husbandoNames = [
  'Levi', 'Gojo', 'Itachi', 'Kakashi', 'Naruto', 'Sasuke',
  'Eren', 'Tanjiro', 'Goku', 'Vegeta', 'Todoroki', 'Bakugo',
  'Deku', 'Killua', 'Gon', 'Light', 'L', 'Spike',
];

const husbandoTraits = [
  'strong and silent', 'charming and confident', 'mysterious and brooding',
  'funny and caring', 'brave and heroic', 'cool and collected',
  'powerful and protective', 'smart and witty', 'kind and loyal',
];

const husbandoRatings = ['S+', 'S', 'A+', 'A', 'B+', 'B', 'C'];

const command: Command = {
  name: 'husbando',
  aliases: ['randomhusbando'],
  description: 'Get a random husbando',
  category: 'fun',
  usage: 'husbando',
  examples: ['husbando'],

  async execute(context: CommandContext): Promise<void> {
    const { api, event, reply } = context;
    const senderId = ('' + event.senderID).trim();

    const name = husbandoNames[Math.floor(Math.random() * husbandoNames.length)];
    const trait = husbandoTraits[Math.floor(Math.random() * husbandoTraits.length)];
    const rating = husbandoRatings[Math.floor(Math.random() * husbandoRatings.length)];
    const compatibility = Math.floor(Math.random() * 51) + 50;

    let userName = 'You';
    try {
      const userInfo = await safeGetUserInfo(api, senderId);
      userName = userInfo[senderId]?.name || 'You';
    } catch {}

    await reply(`💙 *Your Random Husbando* 💙\n\n🤴 Name: ${name}\n✨ Trait: ${trait}\n⭐ Rating: ${rating}\n💘 Compatibility with ${userName}: ${compatibility}%\n\n${compatibility >= 80 ? '🎉 Perfect match!' : compatibility >= 60 ? '💗 Great potential!' : '💛 Could work with effort!'}`);
  }
};

export default command;
