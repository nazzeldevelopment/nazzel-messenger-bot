import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'lucky',
  aliases: ['luckynumber', 'fortune', 'swerte'],
  description: 'Get your lucky numbers for today',
  category: 'fun',
  usage: 'lucky',
  examples: ['lucky'],
  cooldown: 10,

  async execute({ event, reply }) {
    const userId = event.senderID;
    const today = new Date().toDateString();
    
    const seed = (userId + today).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const random = (n: number) => ((seed * (n + 1) * 9301 + 49297) % 233280) / 233280;

    const luckyNumbers: number[] = [];
    for (let i = 0; i < 6; i++) {
      luckyNumbers.push(Math.floor(random(i) * 49) + 1);
    }
    const uniqueNumbers = [...new Set(luckyNumbers)].slice(0, 6);
    while (uniqueNumbers.length < 6) {
      const n = Math.floor(Math.random() * 49) + 1;
      if (!uniqueNumbers.includes(n)) uniqueNumbers.push(n);
    }

    const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Gold', 'Silver', 'White', 'Black', 'Brown'];
    const luckyColor = colors[Math.floor(random(10) * colors.length)];

    const hours = ['1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM',
                   '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'];
    const luckyTime = hours[Math.floor(random(20) * hours.length)];

    const luckPercentage = Math.floor(random(30) * 100) + 1;

    let message = `🍀 *Your Lucky Forecast*\n\n`;
    message += `🎲 Lucky Numbers: ${uniqueNumbers.sort((a, b) => a - b).join(', ')}\n`;
    message += `🎨 Lucky Color: ${luckyColor}\n`;
    message += `⏰ Lucky Time: ${luckyTime}\n`;
    message += `📊 Luck Level: ${luckPercentage}%\n\n`;
    
    if (luckPercentage >= 80) {
      message += `✨ Today is YOUR day! Take risks!`;
    } else if (luckPercentage >= 60) {
      message += `😊 Good vibes coming your way!`;
    } else if (luckPercentage >= 40) {
      message += `🙂 An average day, stay positive!`;
    } else {
      message += `🌈 Stay cautious, better days ahead!`;
    }

    await reply(message);
  },
};
