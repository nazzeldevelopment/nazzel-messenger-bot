import type { Command, CommandContext } from '../../types/index.js';

const yells = [
  "*takes a deep breath and YELLS*",
  "*screams at the top of their lungs*",
  "*shouts loudly*",
  "*bellows dramatically*",
  "*yells with all their might*",
];

const command: Command = {
  name: 'yell',
  aliases: ['shout', 'scream', 'holler'],
  description: 'Yell something loudly',
  category: 'roleplay',
  usage: 'yell <message>',
  examples: ['yell hello everyone'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length === 0) {
      await reply(`Usage: ${prefix}yell <message>`);
      return;
    }

    const action = yells[Math.floor(Math.random() * yells.length)];
    const message = args.join(' ').toUpperCase();

    await reply(`╭─────────────────╮
│ 📢 YELL
╰─────────────────╯

${action}

"${message}!!!"`);
  }
};

export default command;
