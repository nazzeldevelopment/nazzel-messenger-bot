import type { Command } from '../../types/index.js';

const riddles = [
  { q: 'I have keys but no locks. I have space but no room. You can enter but can\'t go inside. What am I?', a: ['keyboard'] },
  { q: 'What has hands but can\'t clap?', a: ['clock', 'watch'] },
  { q: 'What has a head and a tail but no body?', a: ['coin'] },
  { q: 'What gets wetter the more it dries?', a: ['towel'] },
  { q: 'I speak without a mouth and hear without ears. I have no body, but I come alive with the wind. What am I?', a: ['echo'] },
  { q: 'The more you take, the more you leave behind. What am I?', a: ['footsteps', 'steps'] },
  { q: 'What can travel around the world while staying in a corner?', a: ['stamp'] },
  { q: 'What has many teeth but can\'t bite?', a: ['comb'] },
  { q: 'What can you catch but not throw?', a: ['cold', 'a cold'] },
  { q: 'What goes up but never comes down?', a: ['age', 'your age'] },
  { q: 'I\'m tall when I\'m young and short when I\'m old. What am I?', a: ['candle'] },
  { q: 'What has one eye but can\'t see?', a: ['needle'] },
  { q: 'What can you break without touching it?', a: ['promise', 'a promise'] },
  { q: 'What has a thumb and four fingers but isn\'t alive?', a: ['glove'] },
  { q: 'What building has the most stories?', a: ['library', 'a library'] },
];

const activeRiddles = new Map<string, typeof riddles[0]>();

export const command: Command = {
  name: 'riddle',
  aliases: ['bugtong', 'rd'],
  description: 'Solve riddles',
  category: 'games',
  usage: 'riddle | riddle answer <answer>',
  examples: ['riddle', 'riddle answer keyboard'],
  cooldown: 3000,

  async execute({ reply, args, event }) {
    const threadId = event.threadID;

    if (args[0] === 'answer') {
      const current = activeRiddles.get(threadId);
      if (!current) return reply('❌ No active riddle! Start with: riddle');

      const answer = args.slice(1).join(' ').toLowerCase().trim();
      
      if (current.a.some(a => answer.includes(a))) {
        activeRiddles.delete(threadId);
        return reply(`✅ CORRECT! The answer is: ${current.a[0].toUpperCase()}`);
      }

      return reply('❌ Wrong! Think harder!');
    }

    if (activeRiddles.has(threadId)) {
      return reply(`🤔 Current Riddle:\n\n${activeRiddles.get(threadId)!.q}\n\nAnswer: riddle answer <your answer>`);
    }

    const riddle = riddles[Math.floor(Math.random() * riddles.length)];
    activeRiddles.set(threadId, riddle);

    return reply(`🤔 RIDDLE\n\n${riddle.q}\n\nAnswer: riddle answer <your answer>`);
  },
};
