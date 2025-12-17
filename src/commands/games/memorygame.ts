import type { Command } from '../../types/index.js';

const games = new Map<string, { sequence: string[], playerSequence: string[], level: number }>();
const emojis = ['🔴', '🟢', '🔵', '🟡', '🟣', '🟠'];

export const command: Command = {
  name: 'memorygame',
  aliases: ['memory', 'mem', 'simon'],
  description: 'Test your memory - remember the sequence!',
  category: 'games',
  usage: 'memorygame | memorygame <colors>',
  examples: ['memorygame', 'memorygame red green blue'],
  cooldown: 3000,

  async execute({ reply, args, event }) {
    const threadId = event.threadID;

    if (!args.length) {
      const sequence = [emojis[Math.floor(Math.random() * emojis.length)]];
      games.set(threadId, { sequence, playerSequence: [], level: 1 });
      
      await reply(`🧠 MEMORY GAME - Level 1\n\nRemember this sequence:\n${sequence.join(' ')}\n\nRepeat it: memorygame <colors>\nColors: red, green, blue, yellow, purple, orange`);
      return;
    }

    const game = games.get(threadId);
    if (!game) return reply('❌ No active game. Start with: memorygame');

    const colorMap: { [key: string]: string } = {
      red: '🔴', green: '🟢', blue: '🔵', yellow: '🟡', purple: '🟣', orange: '🟠'
    };

    const playerInput = args.map(a => colorMap[a.toLowerCase()]).filter(Boolean);
    
    if (playerInput.length !== game.sequence.length) {
      return reply(`❌ Enter ${game.sequence.length} colors!`);
    }

    const correct = playerInput.every((c, i) => c === game.sequence[i]);
    
    if (!correct) {
      games.delete(threadId);
      return reply(`💀 WRONG!\n\nCorrect: ${game.sequence.join(' ')}\nYour answer: ${playerInput.join(' ')}\n\nYou reached Level ${game.level}!`);
    }

    game.level++;
    game.sequence.push(emojis[Math.floor(Math.random() * emojis.length)]);
    
    await reply(`✅ CORRECT!\n\n🧠 Level ${game.level}\n\nRemember:\n${game.sequence.join(' ')}\n\nRepeat: memorygame <colors>`);
  },
};
