import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'diceroll',
  aliases: ['rolldice', 'd6', 'd20'],
  description: 'Roll dice',
  category: 'games',
  usage: 'diceroll [number of dice] [sides]',
  examples: ['diceroll', 'diceroll 2 6', 'diceroll 1 20'],
  cooldown: 3000,
  async execute({ reply, args }) {
    const numDice = Math.min(parseInt(args[0]) || 1, 10);
    const sides = Math.min(parseInt(args[1]) || 6, 100);
    
    const rolls: number[] = [];
    for (let i = 0; i < numDice; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }
    
    const total = rolls.reduce((a, b) => a + b, 0);
    
    await reply(`🎲 DICE ROLL\n\n${numDice}d${sides}\nRolls: ${rolls.join(', ')}\nTotal: ${total}`);
  },
};
