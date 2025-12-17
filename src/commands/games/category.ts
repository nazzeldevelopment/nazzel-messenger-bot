import type { Command } from '../../types/index.js';
const categories = { animals: ['cat', 'dog', 'elephant', 'lion', 'tiger'], fruits: ['apple', 'banana', 'orange', 'mango', 'grape'], countries: ['japan', 'korea', 'usa', 'philippines', 'france'] };
const games = new Map<string, { cat: string, items: string[] }>();
export const command: Command = { name: 'categorygame', aliases: ['catgame'], description: 'Name items in category', category: 'games', usage: 'categorygame | categorygame <answer>', examples: ['categorygame', 'categorygame cat'], cooldown: 3000,
  async execute({ reply, args, event }) { const tid = event.threadID; if (!args.length) { const cats = Object.keys(categories); const cat = cats[Math.floor(Math.random() * cats.length)]; games.set(tid, { cat, items: [] }); return reply(`📂 CATEGORY GAME\n\nName as many "${cat}" as you can!\n\ncategorygame <item>`); } const game = games.get(tid); if (!game) return reply('❌ Start a game first!'); const item = args[0].toLowerCase(); if (game.items.includes(item)) return reply('❌ Already said!'); game.items.push(item); await reply(`✅ "${item}" added! (${game.items.length} total)`); },
};
