import type { Command, CommandContext } from '../../types/index.js';

const whispers = [
  "*leans in and whispers softly*",
  "*cups hands near your ear and whispers*",
  "*whispers mysteriously*",
  "*whispers in a hushed tone*",
  "*psst... whispers quietly*",
];

const command: Command = {
  name: 'whisper',
  aliases: ['psst', 'secret', 'hush'],
  description: 'Whisper something to someone',
  category: 'roleplay',
  usage: 'whisper <message>',
  examples: ['whisper hello there'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply, prefix } = context;

    if (args.length === 0) {
      await reply(`Usage: ${prefix}whisper <message>`);
      return;
    }

    const action = whispers[Math.floor(Math.random() * whispers.length)];
    const message = args.join(' ');

    await reply(`╭─────────────────╮
│ 🤫 WHISPER
╰─────────────────╯

${action}

"${message}"`);
  }
};

export default command;
