import type { Command, CommandContext } from '../../types/index.js';

const lifehacks = [
  "Use a binder clip to organize your cables on your desk.",
  "Put your phone in a glass to amplify the speaker sound.",
  "Use a rubber band around a paint can to wipe excess paint from your brush.",
  "Freeze leftover coffee in ice cube trays for iced coffee without dilution.",
  "Use a spring from a pen to protect charging cables from breaking.",
  "Place a wooden spoon across a boiling pot to prevent it from boiling over.",
  "Use toothpaste to clean foggy headlights.",
  "Use a dustpan to fill containers that don't fit in the sink.",
  "Use bread clips to label your power cords.",
  "Microwave a lemon for 30 seconds before squeezing to get more juice.",
  "Use a can opener to open plastic blister packaging easily.",
  "Put a dry towel in the dryer with wet clothes to dry faster.",
  "Use a hair straightener to iron shirt collars quickly.",
  "Freeze grapes to use as ice cubes in wine without diluting it.",
  "Use an app like 'Forest' to stay focused and off your phone.",
];

const command: Command = {
  name: 'lifehack',
  aliases: ['hack', 'tip', 'protip'],
  description: 'Get a random life hack tip',
  category: 'ai',
  usage: 'lifehack',
  examples: ['lifehack'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;

    const hack = lifehacks[Math.floor(Math.random() * lifehacks.length)];

    await reply(`╭─────────────────╮
│ 💡 LIFE HACK
╰─────────────────╯

${hack}

🌟 Work smarter, not harder!`);
  }
};

export default command;
