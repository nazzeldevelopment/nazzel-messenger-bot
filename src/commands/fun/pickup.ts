import type { Command, CommandContext } from '../../types/index.js';

const pickupLines = [
  "Are you a magician? Because whenever I look at you, everyone else disappears.",
  "Do you have a map? I keep getting lost in your eyes.",
  "Are you a parking ticket? Because you've got 'fine' written all over you.",
  "Is your name Google? Because you've got everything I've been searching for.",
  "Are you a camera? Because every time I look at you, I smile.",
  "Do you have a Band-Aid? Because I just scraped my knee falling for you.",
  "Are you a bank loan? Because you've got my interest.",
  "Is your dad a boxer? Because you're a knockout!",
  "Are you a time traveler? Because I can see you in my future.",
  "Do you believe in love at first sight, or should I walk by again?",
  "Are you Wi-Fi? Because I'm feeling a connection.",
  "Is your name Chapstick? Because you're da balm!",
  "Are you a campfire? Because you're hot and I want s'more.",
  "Do you have a sunburn, or are you always this hot?",
  "Are you a keyboard? Because you're just my type.",
  "Is your name Ariel? Because we mermaid for each other!",
  "Are you a dictionary? Because you add meaning to my life.",
  "Do you have a mirror in your pocket? Because I can see myself in your pants.",
  "Are you a beaver? Because daaaaam!",
  "Is your dad an artist? Because you're a masterpiece.",
  "Are you Australian? Because you meet all of my koala-fications.",
  "Do you play soccer? Because you're a keeper!",
  "Are you a cat? Because you're purrfect!",
  "Is there an airport nearby, or is that just my heart taking off?",
  "Are you a volcano? Because I lava you!",
  "Do you like science? Because I've got great chemistry with you.",
  "Are you made of copper and tellurium? Because you're Cu-Te!",
  "Is your name Wally? Because someone like you is hard to find.",
  "Are you a light switch? Because you really turn me on!",
  "Do you have a pencil? Because I want to erase your past and write our future.",
];

const command: Command = {
  name: 'pickup',
  aliases: ['pickupline', 'flirt', 'rizz'],
  description: 'Get a random pickup line',
  category: 'fun',
  usage: 'pickup [@user]',
  examples: ['pickup', 'pickup @someone'],

  async execute(context: CommandContext): Promise<void> {
    const { reply, event, api } = context;
    
    const line = pickupLines[Math.floor(Math.random() * pickupLines.length)];
    
    let targetName = '';
    if (event.mentions && Object.keys(event.mentions).length > 0) {
      const mentionId = Object.keys(event.mentions)[0];
      try {
        const userInfo = await api.getUserInfo(mentionId);
        targetName = userInfo[mentionId]?.name?.split(' ')[0] || '';
      } catch (e) {}
    }
    
    await reply(`
╔══════════════════════════════════════╗
║        PICKUP LINE              ║
╠══════════════════════════════════════╣
${targetName ? `║  Hey ${targetName}...           ║\n║                                      ║\n` : ''}║  "${line}"
║                                      ║
╚══════════════════════════════════════╝`);
  },
};

export default command;
