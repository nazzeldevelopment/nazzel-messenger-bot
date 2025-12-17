import type { Command, CommandContext } from '../../types/index.js';

const words = [
  'javascript', 'programming', 'development', 'technology', 'messenger',
  'algorithm', 'database', 'function', 'variable', 'keyboard',
  'computer', 'software', 'hardware', 'internet', 'network',
  'security', 'encryption', 'application', 'framework', 'library',
  'typescript', 'react', 'nodejs', 'python', 'github',
];

const sentences = [
  'The quick brown fox jumps over the lazy dog',
  'Pack my box with five dozen liquor jugs',
  'How vexingly quick daft zebras jump',
  'The five boxing wizards jump quickly',
  'Sphinx of black quartz judge my vow',
];

const command: Command = {
  name: 'typefast',
  aliases: ['typing', 'speedtype', 'typingtest'],
  description: 'Test your typing speed',
  category: 'games',
  usage: 'typefast [word/sentence]',
  examples: ['typefast', 'typefast sentence'],
  cooldown: 5000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;
    
    const mode = args[0]?.toLowerCase();
    
    if (mode === 'sentence') {
      const sentence = sentences[Math.floor(Math.random() * sentences.length)];
      await reply(`╭─────────────────╮
│ ⌨️ TYPE FAST
╰─────────────────╯

Type this sentence:

"${sentence}"

Go! ⏱️`);
    } else {
      const word = words[Math.floor(Math.random() * words.length)];
      await reply(`╭─────────────────╮
│ ⌨️ TYPE FAST
╰─────────────────╯

Type this word:

"${word}"

Go! ⏱️`);
    }
  }
};

export default command;
