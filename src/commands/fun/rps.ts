import type { Command } from '../../types/index.js';
import { decorations } from '../../lib/messageFormatter.js';

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
  cooldown: 3000,

  async execute({ args, reply, prefix }) {
    if (!args[0]) {
      await reply(`✊✋✌️ 『 RPS GAME 』 ✊✋✌️
═══════════════════════════
${decorations.sparkle} Rock Paper Scissors!
═══════════════════════════

◈ HOW TO PLAY
═══════════════════════════
➤ ${prefix}rps rock
➤ ${prefix}rps paper
➤ ${prefix}rps scissors

🇵🇭 Also accepts:
➤ bato, papel, gunting`);
      return;
    }

    let playerChoice = args[0].toLowerCase();
    
    if (tagalog.rock === playerChoice) playerChoice = 'rock';
    if (tagalog.paper === playerChoice) playerChoice = 'paper';
    if (tagalog.scissors === playerChoice) playerChoice = 'scissors';
    
    if (!choices.includes(playerChoice)) {
      await reply(`${decorations.fire} 『 INVALID 』
═══════════════════════════
❌ Choose: rock, paper, scissors`);
      return;
    }

    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    const result = determineWinner(playerChoice, botChoice);

    let resultEmoji = '';
    let resultText = '';
    let resultColor = '';
    
    if (result === 'win') {
      resultEmoji = '🎉';
      resultText = 'YOU WIN!';
      resultColor = '🟢';
    } else if (result === 'lose') {
      resultEmoji = '😢';
      resultText = 'YOU LOSE!';
      resultColor = '🔴';
    } else {
      resultEmoji = '🤝';
      resultText = 'IT\'S A DRAW!';
      resultColor = '🟡';
    }

    await reply(`✊✋✌️ 『 RPS GAME 』 ✊✋✌️
═══════════════════════════

👤 You: ${emojis[playerChoice]} ${playerChoice.toUpperCase()}
     VS
🤖 Bot: ${emojis[botChoice]} ${botChoice.toUpperCase()}

═══════════════════════════
${resultColor} ${resultEmoji} ${resultText} ${resultEmoji}
═══════════════════════════
${decorations.sparkle} Good game!`);
  },
};
