import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'countdownfun',
  aliases: ['newyear', 'christmas'],
  description: 'Countdown to special events',
  category: 'fun',
  usage: 'countdownfun',
  examples: ['countdownfun'],
  cooldown: 5000,
  async execute({ reply }) {
    const now = new Date();
    const year = now.getFullYear();
    
    const christmas = new Date(year, 11, 25);
    if (christmas < now) christmas.setFullYear(year + 1);
    
    const newYear = new Date(year + 1, 0, 1);
    
    const toChristmas = Math.ceil((christmas.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const toNewYear = Math.ceil((newYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    await reply(`⏰ COUNTDOWN\n\n🎄 Christmas: ${toChristmas} days\n🎆 New Year: ${toNewYear} days`);
  },
};
