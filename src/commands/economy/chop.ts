import type { Command } from '../../types/index.js';
const trees = ['🌲 Pine', '🌳 Oak', '🌴 Palm', '🌿 Bamboo', '🍁 Maple'];
export const command: Command = { name: 'chop', aliases: ['woodcut'], description: 'Chop trees', category: 'economy', usage: 'chop', examples: ['chop'], cooldown: 30000,
  async execute({ reply }) { const tree = trees[Math.floor(Math.random() * trees.length)]; const logs = Math.floor(Math.random() * 10) + 1; await reply(`🪓 CHOPPING\n\nYou chopped: ${tree}\nLogs: ${logs} ($${logs * 5})`); },
};
