import type { Command, CommandContext } from '../../types/index.js';

const haikus = [
  { line1: "Cherry blossoms fall", line2: "Softly drifting in the breeze", line3: "Spring's gentle farewell" },
  { line1: "Moonlight on the lake", line2: "Ripples dance in silver light", line3: "Peace fills the still night" },
  { line1: "Morning dew drops shine", line2: "Diamonds scattered on green grass", line3: "Nature's jewelry" },
  { line1: "Autumn leaves descend", line2: "Painting forests gold and red", line3: "Season of change comes" },
  { line1: "Ocean waves crash down", line2: "Endless rhythm of the sea", line3: "Eternal power" },
  { line1: "Snow falls silently", line2: "Covering the world in white", line3: "Winter's soft blanket" },
  { line1: "Fireflies at dusk", line2: "Dancing lanterns in the dark", line3: "Summer magic glows" },
  { line1: "Birds sing at sunrise", line2: "Welcoming the brand new day", line3: "Hope springs eternal" },
];

const command: Command = {
  name: 'haiku',
  aliases: ['poem2', 'japanesepoem', '575'],
  description: 'Generate a random haiku poem',
  category: 'ai',
  usage: 'haiku',
  examples: ['haiku'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;

    const haiku = haikus[Math.floor(Math.random() * haikus.length)];

    await reply(`╭─────────────────╮
│ 🌸 HAIKU
╰─────────────────╯

${haiku.line1}
${haiku.line2}
${haiku.line3}

✨ 5-7-5 syllables`);
  }
};

export default command;
