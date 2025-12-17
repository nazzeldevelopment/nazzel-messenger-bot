import type { Command, CommandContext } from '../../types/index.js';

const actions = [
  "*dramatically faints*",
  "*swoons and collapses gracefully*",
  "*feels dizzy and falls over*",
  "*passes out dramatically*",
  "*falls to the ground in a heap*",
];

const command: Command = {
  name: 'faint',
  aliases: ['passout', 'collapse', 'swoon'],
  description: 'Faint dramatically',
  category: 'roleplay',
  usage: 'faint',
  examples: ['faint'],
  cooldown: 10000,

  async execute(context: CommandContext): Promise<void> {
    const { reply } = context;

    const action = actions[Math.floor(Math.random() * actions.length)];

    await reply(`╭─────────────────╮
│ 😵 FAINT
╰─────────────────╯

${action}

💫 Someone help! 💫`);
  }
};

export default command;
