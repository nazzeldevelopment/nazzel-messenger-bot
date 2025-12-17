import type { Command } from '../../types/index.js';

const triviaQuestions = [
  { q: 'What is the largest planet in our solar system?', a: 'jupiter' },
  { q: 'In what year did the Berlin Wall fall?', a: '1989' },
  { q: 'What is the chemical symbol for Iron?', a: 'fe' },
  { q: 'Who wrote Romeo and Juliet?', a: 'shakespeare' },
  { q: 'What is the capital of Australia?', a: 'canberra' },
  { q: 'How many bones are in the adult human body?', a: '206' },
  { q: 'What planet is closest to the Sun?', a: 'mercury' },
  { q: 'In what year was Facebook founded?', a: '2004' },
  { q: 'What is the hardest natural substance on Earth?', a: 'diamond' },
  { q: 'Who painted the Starry Night?', a: 'van gogh' },
  { q: 'What is the smallest prime number?', a: '2' },
  { q: 'What year did World War 1 start?', a: '1914' },
  { q: 'What is the main component of the Sun?', a: 'hydrogen' },
  { q: 'How many sides does a hexagon have?', a: '6' },
  { q: 'What is the longest river in the world?', a: 'nile' },
];

const battles = new Map<string, { question: typeof triviaQuestions[0], scores: Map<string, number>, round: number, maxRounds: number }>();

export const command: Command = {
  name: 'triviabattle',
  aliases: ['tb', 'triviawar'],
  description: 'Compete in trivia battles',
  category: 'games',
  usage: 'triviabattle | triviabattle <answer> | triviabattle score',
  examples: ['triviabattle', 'triviabattle jupiter'],
  cooldown: 2000,

  async execute({ reply, args, event }) {
    const threadId = event.threadID;
    const senderId = event.senderID;

    if (args[0] === 'score') {
      const battle = battles.get(threadId);
      if (!battle) return reply('❌ No active battle.');
      
      const scores = Array.from(battle.scores.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([id, score], i) => `${i + 1}. ${id.slice(-4)}: ${score} pts`)
        .join('\n');
      
      return reply(`📊 SCORES\n\n${scores || 'No scores yet'}\n\nRound ${battle.round}/${battle.maxRounds}`);
    }

    if (!args.length) {
      if (battles.has(threadId)) {
        const battle = battles.get(threadId)!;
        return reply(`❓ Current Question (Round ${battle.round}):\n\n${battle.question.q}\n\nAnswer: triviabattle <answer>`);
      }

      const question = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
      battles.set(threadId, { question, scores: new Map(), round: 1, maxRounds: 5 });
      
      return reply(`🏆 TRIVIA BATTLE\n\nRound 1/5\n\n${question.q}\n\nAnswer: triviabattle <answer>`);
    }

    const battle = battles.get(threadId);
    if (!battle) return reply('❌ No active battle. Start with: triviabattle');

    const answer = args.join(' ').toLowerCase().trim();
    
    if (answer === battle.question.a || battle.question.a.includes(answer)) {
      const currentScore = battle.scores.get(senderId) || 0;
      battle.scores.set(senderId, currentScore + 10);
      
      if (battle.round >= battle.maxRounds) {
        const scores = Array.from(battle.scores.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([id, score], i) => `${i + 1}. ${id.slice(-4)}: ${score} pts`)
          .join('\n');
        
        battles.delete(threadId);
        return reply(`🏆 BATTLE OVER!\n\n${scores}\n\n🎉 Winner: ${Array.from(battle.scores.entries()).sort((a, b) => b[1] - a[1])[0]?.[0].slice(-4) || 'No one'}!`);
      }

      battle.round++;
      battle.question = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
      
      return reply(`✅ CORRECT! +10 pts\n\n🏆 Round ${battle.round}/${battle.maxRounds}\n\n${battle.question.q}`);
    }

    return reply('❌ Wrong answer! Try again!');
  },
};
