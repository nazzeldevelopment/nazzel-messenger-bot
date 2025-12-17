import type { Command } from '../../types/index.js';

const quizzes = [
  { q: 'What is the capital of Philippines?', a: ['manila'], c: 'Manila' },
  { q: 'What planet is known as the Red Planet?', a: ['mars'], c: 'Mars' },
  { q: 'How many continents are there?', a: ['7', 'seven'], c: '7' },
  { q: 'What is the largest ocean?', a: ['pacific', 'pacific ocean'], c: 'Pacific Ocean' },
  { q: 'What year did World War 2 end?', a: ['1945'], c: '1945' },
  { q: 'What is H2O commonly known as?', a: ['water', 'tubig'], c: 'Water' },
  { q: 'How many colors are in a rainbow?', a: ['7', 'seven'], c: '7' },
  { q: 'What is the largest mammal?', a: ['blue whale', 'whale'], c: 'Blue Whale' },
  { q: 'What is the currency of Japan?', a: ['yen', 'japanese yen'], c: 'Yen' },
  { q: 'Who painted the Mona Lisa?', a: ['leonardo da vinci', 'da vinci', 'leonardo'], c: 'Leonardo da Vinci' },
  { q: 'What is the smallest country in the world?', a: ['vatican', 'vatican city'], c: 'Vatican City' },
  { q: 'How many legs does a spider have?', a: ['8', 'eight'], c: '8' },
  { q: 'What is the chemical symbol for gold?', a: ['au'], c: 'Au' },
  { q: 'In what year did the Titanic sink?', a: ['1912'], c: '1912' },
  { q: 'What is the fastest land animal?', a: ['cheetah'], c: 'Cheetah' },
];

const activeQuiz = new Map<string, { quiz: typeof quizzes[0], startTime: number }>();

export const command: Command = {
  name: 'quiz',
  aliases: ['q', 'tanong'],
  description: 'Answer trivia questions',
  category: 'games',
  usage: 'quiz | quiz answer <answer>',
  examples: ['quiz', 'quiz answer manila'],
  cooldown: 3000,

  async execute({ reply, args, event }) {
    const threadId = event.threadID;

    if (args[0] === 'answer') {
      const current = activeQuiz.get(threadId);
      if (!current) return reply('❌ No active quiz! Start with: quiz');

      const answer = args.slice(1).join(' ').toLowerCase().trim();
      if (!answer) return reply('❌ Provide your answer!');

      const elapsed = Math.floor((Date.now() - current.startTime) / 1000);
      
      if (current.quiz.a.includes(answer)) {
        activeQuiz.delete(threadId);
        return reply(`✅ CORRECT!\n\nAnswer: ${current.quiz.c}\nTime: ${elapsed}s`);
      }

      return reply('❌ Wrong! Try again!');
    }

    if (activeQuiz.has(threadId)) {
      const current = activeQuiz.get(threadId)!;
      return reply(`❓ Current Question:\n\n${current.quiz.q}\n\nAnswer: quiz answer <your answer>`);
    }

    const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];
    activeQuiz.set(threadId, { quiz, startTime: Date.now() });

    return reply(`❓ QUIZ TIME!\n\n${quiz.q}\n\nAnswer: quiz answer <your answer>`);
  },
};
