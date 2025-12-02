import type { Command } from '../../types/index.js';

const choices = ['rock', 'paper', 'scissors'];
const emojis: Record<string, string> = {
  rock: '🪨',
  paper: '📄',
  scissors: '✂️',
};
const tagalog: Record<string, string> = {
  rock: 'bato',
  paper: 'papel',
  scissors: 'gunting',
};

function determineWinner(player: string, bot: string): 'win' | 'lose' | 'draw' {
  if (player === bot) return 'draw';
  if (
    (player === 'rock' && bot === 'scissors') ||
    (player === 'paper' && bot === 'rock') ||
    (player === 'scissors' && bot === 'paper')
  ) {
    return 'win';
  }
  return 'lose';
}

export const command: Command = {
  name: 'rps',
  aliases: ['rockpaperscissors', 'bato', 'janken'],
  description: 'Play rock paper scissors with the bot',
  category: 'fun',
  usage: 'rps <rock/paper/scissors>',
  examples: ['rps rock', 'rps paper', 'rps scissors'],
  cooldown: 3,

  async execute({ args, reply }) {
    if (!args[0]) {
      await reply(`✊✋✌️ *Rock Paper Scissors*\n\nUsage: rps <rock/paper/scissors>\n\nExamples:\n• rps rock\n• rps paper\n• rps scissors`);
      return;
    }

    let playerChoice = args[0].toLowerCase();
    
    if (tagalog.rock === playerChoice) playerChoice = 'rock';
    if (tagalog.paper === playerChoice) playerChoice = 'paper';
    if (tagalog.scissors === playerChoice) playerChoice = 'scissors';
    
    if (!choices.includes(playerChoice)) {
      await reply(`❌ Invalid choice! Please choose rock, paper, or scissors.`);
      return;
    }

    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    const result = determineWinner(playerChoice, botChoice);

    let message = `✊✋✌️ *Rock Paper Scissors*\n\n`;
    message += `You: ${emojis[playerChoice]} ${playerChoice.charAt(0).toUpperCase() + playerChoice.slice(1)}\n`;
    message += `Bot: ${emojis[botChoice]} ${botChoice.charAt(0).toUpperCase() + botChoice.slice(1)}\n\n`;

    if (result === 'win') {
      message += `🎉 *You WIN!* Congratulations!`;
    } else if (result === 'lose') {
      message += `😢 *You LOSE!* Better luck next time!`;
    } else {
      message += `🤝 *It's a DRAW!* Great minds think alike!`;
    }

    await reply(message);
  },
};
