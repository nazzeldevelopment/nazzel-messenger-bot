import type { Command } from '../../types/index.js';
const achievements = ['🏆 First Win', '💰 Rich', '🎮 Gamer', '💬 Chatterbox', '👑 Legend'];
export const command: Command = { name: 'achievements', aliases: ['achieve', 'badges'], description: 'View achievements', category: 'economy', usage: 'achievements', examples: ['achievements'], cooldown: 5000,
  async execute({ reply }) { const unlocked = achievements.slice(0, Math.floor(Math.random() * 5) + 1); await reply(`🏆 ACHIEVEMENTS\n\n${unlocked.join('\n')}`); },
};
