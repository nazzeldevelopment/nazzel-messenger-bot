import type { Command, CommandContext } from '../../types/index.js';

const dares = [
  "Send a voice message singing your favorite song!",
  "Change your profile picture to a funny photo for 1 hour!",
  "Send a message using only emojis for the next 5 messages!",
  "Tell an embarrassing story about yourself!",
  "Compliment everyone in this group chat!",
  "Send a message in ALL CAPS for the next 3 messages!",
  "Reveal your last Google search!",
  "Send a childhood photo of yourself!",
  "Write a short poem about the person above you!",
  "Share your most played song of the week!",
  "Reveal your biggest fear!",
  "Send a message with your eyes closed!",
  "Do 10 push-ups and send a photo/video as proof!",
  "Tell us your weirdest habit!",
  "Share your most recent screenshot!",
  "Speak in a funny accent in your next voice message!",
  "Reveal your celebrity crush!",
  "Tell us your most embarrassing moment!",
  "Send a selfie right now without any filters!",
  "Let someone in the group post something on your story!",
  "Share your screen time for today!",
  "Reveal your WiFi password!",
  "Sing the chorus of your least favorite song!",
  "Tell your most recent lie!",
  "Act like a cat for the next 5 minutes!",
  "Say 'I love you' to the next person who messages!",
  "Share your most used emoji!",
  "Tell us something nobody knows about you!",
  "Share the last photo you took on your phone!",
  "Do your best impression of someone in this group!",
];

const command: Command = {
  name: 'dare',
  aliases: ['d'],
  description: 'Get a random dare challenge',
  category: 'fun',
  usage: 'dare',
  examples: ['dare'],

  async execute(context: CommandContext): Promise<void> {
    const { reply, event, api } = context;
    const senderId = event.senderID;
    
    let userName = 'Brave Soul';
    try {
      const userInfo = await api.getUserInfo(senderId);
      userName = userInfo[senderId]?.name?.split(' ')[0] || 'Brave Soul';
    } catch (e) {}
    
    const dare = dares[Math.floor(Math.random() * dares.length)];
    
    await reply(`
╔══════════════════════════════════════╗
║        DARE CHALLENGE           ║
╠══════════════════════════════════════╣
║                                      ║
║  ${userName}, you've been dared!    ║
║                                      ║
╠══════════════════════════════════════╣
║                                      ║
║  ${dare}
║                                      ║
╠══════════════════════════════════════╣
║                                      ║
║  Will you accept the challenge?     ║
║                                      ║
╚══════════════════════════════════════╝`);
  },
};

export default command;
