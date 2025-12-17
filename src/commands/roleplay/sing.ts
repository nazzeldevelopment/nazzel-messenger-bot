import type { Command, CommandContext } from '../../types/index.js';

const actions = [
  "*clears throat and starts singing*",
  "*grabs an imaginary microphone*",
  "*starts humming and singing*",
  "*sings melodically*",
  "*belts out a tune*",
];

const command: Command = {
  name: 'sing',
  aliases: ['singing', 'song', 'melody'],
  description: 'Sing something',
  category: 'roleplay',
  usage: 'sing <lyrics>',
  examples: ['sing la la la la la'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length === 0) {
      await reply(`Usage: ${prefix}sing <lyrics>`);
      return;
    }

    const action = actions[Math.floor(Math.random() * actions.length)];
    const lyrics = args.join(' ');

    await reply(`╭─────────────────╮
│ 🎤 SING
╰─────────────────╯

${action}

🎵 "${lyrics}" 🎵`);
  }
};

export default command;
