import type { Command, CommandContext } from '../../types/index.js';

const actions = [
  "*throws confetti in the air*",
  "*does a happy dance*",
  "*jumps up and down excitedly*",
  "*pops champagne*",
  "*cheers and claps enthusiastically*",
  "*spins around in celebration*",
];

const command: Command = {
  name: 'celebrate',
  aliases: ['party', 'cheer', 'woohoo'],
  description: 'Celebrate something',
  category: 'roleplay',
  usage: 'celebrate [reason]',
  examples: ['celebrate', 'celebrate we won!'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;

    const action = actions[Math.floor(Math.random() * actions.length)];
    const reason = args.length > 0 ? args.join(' ') : 'for no particular reason';

    await reply(`╭─────────────────╮
│ 🎉 CELEBRATE
╰─────────────────╯

${action}

Celebrating ${reason}!

🎊🎉🎈🥳`);
  }
};

export default command;
