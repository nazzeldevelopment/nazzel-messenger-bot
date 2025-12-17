import type { Command } from '../../types/index.js';

const sentences = [
  'The quick brown fox jumps over the lazy dog',
  'Pack my box with five dozen liquor jugs',
  'How vexingly quick daft zebras jump',
  'The five boxing wizards jump quickly',
  'Jackdaws love my big sphinx of quartz',
  'Two driven jocks help fax my big quiz',
  'The jay pig fox quiz drove my luck',
  'Quick zephyrs blow vexing daft gym',
  'Sphinx of black quartz judge my vow',
  'Waltz bad nymph for quick jigs vex',
];

const games = new Map<string, { sentence: string, startTime: number }>();

export const command: Command = {
  name: 'typingrace',
  aliases: ['type', 'typing', 'tr'],
  description: 'Test your typing speed',
  category: 'games',
  usage: 'typingrace | typingrace <sentence>',
  examples: ['typingrace'],
  cooldown: 5000,

  async execute({ reply, args, event }) {
    const threadId = event.threadID;

    if (!args.length) {
      const sentence = sentences[Math.floor(Math.random() * sentences.length)];
      games.set(threadId, { sentence, startTime: Date.now() });
      
      return reply(`⌨️ TYPING RACE\n\nType this exactly:\n\n"${sentence}"\n\nGo: typingrace <sentence>`);
    }

    const game = games.get(threadId);
    if (!game) return reply('❌ No active game. Start with: typingrace');

    const typed = args.join(' ');
    const elapsed = (Date.now() - game.startTime) / 1000;
    const words = game.sentence.split(' ').length;
    const wpm = Math.round((words / elapsed) * 60);

    let correct = 0;
    for (let i = 0; i < game.sentence.length; i++) {
      if (typed[i] === game.sentence[i]) correct++;
    }
    const accuracy = Math.round((correct / game.sentence.length) * 100);

    games.delete(threadId);

    let rating = '';
    if (wpm > 80) rating = '⚡ BLAZING FAST!';
    else if (wpm > 60) rating = '🔥 Excellent!';
    else if (wpm > 40) rating = '👍 Good!';
    else if (wpm > 25) rating = '😐 Average';
    else rating = '🐢 Keep practicing!';

    return reply(`⌨️ TYPING RESULTS\n\n⏱️ Time: ${elapsed.toFixed(1)}s\n📊 Speed: ${wpm} WPM\n🎯 Accuracy: ${accuracy}%\n\n${rating}`);
  },
};
