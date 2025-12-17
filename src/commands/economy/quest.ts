import type { Command } from '../../types/index.js';
const quests = ['Defeat 5 monsters', 'Collect 10 herbs', 'Deliver a package', 'Find the lost item', 'Rescue the villager'];
export const command: Command = { name: 'quest', aliases: ['mission'], description: 'Start a quest', category: 'economy', usage: 'quest', examples: ['quest'], cooldown: 60000,
  async execute({ reply }) { const quest = quests[Math.floor(Math.random() * quests.length)]; const reward = Math.floor(Math.random() * 200) + 50; await reply(`📜 QUEST\n\nMission: ${quest}\nReward: $${reward}\n\n(Quest completed!)`); },
};
