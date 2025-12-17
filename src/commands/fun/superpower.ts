import type { Command } from '../../types/index.js';
const powers = ['🔥 Fire Manipulation', '❄️ Ice Control', '⚡ Super Speed', '💪 Super Strength', '🌊 Water Bending', '🌪️ Wind Control', '🧠 Telepathy', '👁️ X-Ray Vision', '✨ Teleportation', '🛡️ Invincibility'];
export const command: Command = { name: 'superpower', aliases: ['mypower'], description: 'Your superpower', category: 'fun', usage: 'superpower', examples: ['superpower'], cooldown: 30000,
  async execute({ reply }) { await reply(`🦸 YOUR SUPERPOWER\n\n${powers[Math.floor(Math.random() * powers.length)]}`); },
};
