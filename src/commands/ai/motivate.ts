import type { Command } from '../../types/index.js';

const motivations = [
  '🔥 Every champion was once a contender who refused to give up!',
  '💪 The only way to do great work is to love what you do!',
  '⭐ Your potential is endless. Go do what you were created to do!',
  '🌟 Believe you can and you\'re halfway there!',
  '🚀 The secret of getting ahead is getting started!',
  '💫 Don\'t watch the clock; do what it does. Keep going!',
  '🔥 Success is not final, failure is not fatal: it is the courage to continue that counts!',
  '💪 The harder you work for something, the greater you\'ll feel when you achieve it!',
  '⭐ Dream big and dare to fail!',
  '🌟 Kaya mo yan! Laban lang!',
];

export const command: Command = {
  name: 'motivate',
  aliases: ['motivation', 'inspire'],
  description: 'Get motivated',
  category: 'ai',
  usage: 'motivate',
  examples: ['motivate'],
  cooldown: 5000,
  async execute({ reply }) {
    const motivation = motivations[Math.floor(Math.random() * motivations.length)];
    await reply(`🎯 MOTIVATION\n\n${motivation}\n\n💪 Now go crush it!`);
  },
};
