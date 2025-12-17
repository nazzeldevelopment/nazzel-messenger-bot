import type { Command } from '../../types/index.js';

const symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎', '7️⃣', '⭐'];

export const command: Command = {
  name: 'slotmachine',
  aliases: ['slot', 'jackpot'],
  description: 'Spin the slot machine',
  category: 'games',
  usage: 'slotmachine',
  examples: ['slotmachine'],
  cooldown: 5000,

  async execute({ reply }) {
    const spin = () => symbols[Math.floor(Math.random() * symbols.length)];
    const result = [spin(), spin(), spin()];
    
    let message = `🎰 SLOT MACHINE 🎰\n\n━━━━━━━━━━━\n┃ ${result[0]} ┃ ${result[1]} ┃ ${result[2]} ┃\n━━━━━━━━━━━\n\n`;

    if (result[0] === result[1] && result[1] === result[2]) {
      if (result[0] === '7️⃣') {
        message += '🎉🎉🎉 MEGA JACKPOT! 🎉🎉🎉';
      } else if (result[0] === '💎') {
        message += '💎💎💎 DIAMOND WIN! 💎💎💎';
      } else {
        message += '🎉 JACKPOT! 3 of a kind! 🎉';
      }
    } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
      message += '⭐ Nice! 2 matching! ⭐';
    } else {
      message += '💨 No match. Try again!';
    }

    await reply(message);
  },
};
