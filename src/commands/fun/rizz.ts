import type { Command, CommandContext } from '../../types/index.js';

const rizzLines = [
  "Are you a magician? Because whenever I look at you, everyone else disappears.",
  "Do you have a map? I keep getting lost in your eyes.",
  "Is your name Google? Because you have everything I've been searching for.",
  "Are you a parking ticket? Because you've got 'fine' written all over you.",
  "Do you have a Band-Aid? I just scraped my knee falling for you.",
  "Is your dad a boxer? Because you're a knockout!",
  "Are you a camera? Every time I look at you, I smile.",
  "Do you believe in love at first sight, or should I walk by again?",
  "Are you a time traveler? Because I see you in my future.",
  "Is it hot in here or is it just you?",
  "If beauty were time, you'd be an eternity.",
  "Are you made of copper and tellurium? Because you're Cu-Te.",
  "Do you have a sunburn, or are you always this hot?",
  "Are you a dictionary? Because you add meaning to my life.",
  "Is your name Wi-Fi? Because I'm feeling a connection.",
  "Are you an angel? Because heaven is missing one.",
  "Do you have a twin? Then you must be the beautiful one.",
  "Are you a volcano? Because you make my heart erupt.",
  "Is your dad an artist? Because you're a masterpiece.",
  "Are you a campfire? Because you're hot and I want s'more.",
];

const command: Command = {
  name: 'rizz',
  aliases: ['pickupline', 'flirt', 'smoothline'],
  description: 'Get a rizz/pickup line',
  category: 'fun',
  usage: 'rizz',
  examples: ['rizz'],
  cooldown: 3000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;
    const line = rizzLines[Math.floor(Math.random() * rizzLines.length)];
    const rizzLevel = Math.floor(Math.random() * 100) + 1;

    await reply(`╭─────────────────╮
│ 😏 RIZZ LINE
╰─────────────────╯

"${line}"

Rizz Level: ${'❤️'.repeat(Math.ceil(rizzLevel / 20))} ${rizzLevel}%`);
  }
};

export default command;
