import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'shipname', aliases: ['ship2', 'couple'], description: 'Generate a ship name', category: 'fun',
  usage: 'shipname <name1> <name2>', examples: ['shipname John Jane'], cooldown: 3000,
  async execute({ reply, args }) {
    if (args.length < 2) return reply('❌ Provide two names!');
    const name1 = args[0].slice(0, Math.ceil(args[0].length / 2));
    const name2 = args[1].slice(Math.floor(args[1].length / 2));
    await reply(`💕 SHIP NAME\n\n${args[0]} + ${args[1]} = ${name1}${name2}`);
  },
};
