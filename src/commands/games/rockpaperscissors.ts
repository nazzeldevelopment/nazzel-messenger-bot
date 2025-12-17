import type { Command } from '../../types/index.js';

const choices = ['rock', 'paper', 'scissors'];
const emojis: { [key: string]: string } = { rock: '🪨', paper: '📄', scissors: '✂️' };

export const command: Command = {
  name: 'rockpaperscissors',
  aliases: ['rpsbot', 'janken'],
  description: 'Play Rock Paper Scissors against the bot',
  category: 'games',
  usage: 'rockpaperscissors <rock/paper/scissors>',
  examples: ['rockpaperscissors rock'],
  cooldown: 3000,
  async execute({ reply, args }) {
    if (!args.length) return reply('❌ Choose: rock, paper, or scissors!');
    const player = args[0].toLowerCase();
    if (!choices.includes(player)) return reply('❌ Choose: rock, paper, or scissors!');
    
    const bot = choices[Math.floor(Math.random() * 3)];
    let result = '';
    
    if (player === bot) result = '🤝 TIE!';
    else if ((player === 'rock' && bot === 'scissors') || (player === 'paper' && bot === 'rock') || (player === 'scissors' && bot === 'paper')) result = '🎉 YOU WIN!';
    else result = '💀 YOU LOSE!';
    
    await reply(`🎮 RPS\n\nYou: ${emojis[player]}\nBot: ${emojis[bot]}\n\n${result}`);
  },
};
