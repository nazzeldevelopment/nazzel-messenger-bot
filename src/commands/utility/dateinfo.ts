import type { Command } from '../../types/index.js';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const command: Command = {
  name: 'dateinfo',
  aliases: ['date', 'today'],
  description: 'Get current date information',
  category: 'utility',
  usage: 'dateinfo',
  examples: ['dateinfo'],
  cooldown: 3000,
  async execute({ reply }) {
    const now = new Date();
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();
    const week = Math.ceil((now.getDate() + new Date(now.getFullYear(), now.getMonth(), 1).getDay()) / 7);
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    await reply(`📅 DATE INFO\n\n${dayName}, ${monthName} ${date}, ${year}\n\nWeek of month: ${week}\nDay of year: ${dayOfYear}`);
  },
};
