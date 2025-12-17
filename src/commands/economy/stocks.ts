import type { Command } from '../../types/index.js';
const stocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'TSLA'];
export const command: Command = { name: 'stocks', aliases: ['stock', 'invest'], description: 'View stocks', category: 'economy', usage: 'stocks', examples: ['stocks'], cooldown: 10000,
  async execute({ reply }) { const data = stocks.map(s => ({ name: s, price: (Math.random() * 200 + 50).toFixed(2), change: (Math.random() * 10 - 5).toFixed(2) })); await reply(`📈 STOCKS\n\n${data.map(s => `${s.name}: $${s.price} (${parseFloat(s.change) >= 0 ? '+' : ''}${s.change}%)`).join('\n')}`); },
};
