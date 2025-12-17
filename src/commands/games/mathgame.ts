import type { Command } from '../../types/index.js';

const activeGames = new Map<string, { question: string, answer: number, startTime: number }>();

function generateQuestion(): { question: string, answer: number } {
  const ops = ['+', '-', '*'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;

  switch (op) {
    case '+':
      a = Math.floor(Math.random() * 100);
      b = Math.floor(Math.random() * 100);
      answer = a + b;
      break;
    case '-':
      a = Math.floor(Math.random() * 100);
      b = Math.floor(Math.random() * a);
      answer = a - b;
      break;
    case '*':
      a = Math.floor(Math.random() * 12) + 1;
      b = Math.floor(Math.random() * 12) + 1;
      answer = a * b;
      break;
    default:
      a = 1; b = 1; answer = 2;
  }

  return { question: `${a} ${op} ${b}`, answer };
}

export const command: Command = {
  name: 'mathgame',
  aliases: ['math', 'mg', 'calculate'],
  description: 'Solve math problems quickly!',
  category: 'games',
  usage: 'mathgame | mathgame <answer>',
  examples: ['mathgame', 'mathgame 42'],
  cooldown: 2000,

  async execute({ reply, args, event }) {
    const threadId = event.threadID;

    if (!args.length) {
      const { question, answer } = generateQuestion();
      activeGames.set(threadId, { question, answer, startTime: Date.now() });
      return reply(`🔢 MATH GAME\n\nSolve: ${question} = ?\n\nAnswer: mathgame <number>`);
    }

    const game = activeGames.get(threadId);
    if (!game) return reply('❌ No active game. Start with: mathgame');

    const userAnswer = parseInt(args[0]);
    if (isNaN(userAnswer)) return reply('❌ Enter a number!');

    const elapsed = ((Date.now() - game.startTime) / 1000).toFixed(1);

    if (userAnswer === game.answer) {
      activeGames.delete(threadId);
      return reply(`✅ CORRECT!\n${game.question} = ${game.answer}\nTime: ${elapsed}s`);
    }

    return reply(`❌ Wrong! The answer was ${game.answer}`);
  },
};
