import type { Command } from '../../types/index.js';

export const command: Command = {
  name: 'agecalc',
  aliases: ['birthday', 'myage'],
  description: 'Calculate age from birthday',
  category: 'utility',
  usage: 'agecalc <YYYY-MM-DD>',
  examples: ['agecalc 2000-01-15'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Provide your birthday (YYYY-MM-DD)!');
    
    const birthDate = new Date(args[0]);
    if (isNaN(birthDate.getTime())) return reply('❌ Invalid date format! Use YYYY-MM-DD');
    
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
    const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    await reply(`🎂 AGE CALCULATOR\n\nAge: ${age} years old\nNext birthday: ${daysUntil} days`);
  },
};
