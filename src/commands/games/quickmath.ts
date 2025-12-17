import type { Command, CommandContext } from '../../types/index.js';

const command: Command = {
  name: 'quickmath',
  aliases: ['qm', 'mathquiz', 'calculate'],
  description: 'Quick math challenge',
  category: 'games',
  usage: 'quickmath [easy/medium/hard]',
  examples: ['quickmath', 'quickmath hard'],
  cooldown: 3000,

  async execute(context: CommandContext): Promise<void> {
    const { args, reply } = context;
    
    const difficulty = args[0]?.toLowerCase() || 'easy';
    
    let a: number, b: number, operator: string, answer: number;
    
    if (difficulty === 'hard') {
      a = Math.floor(Math.random() * 50) + 10;
      b = Math.floor(Math.random() * 50) + 10;
      const ops = ['+', '-', '*'];
      operator = ops[Math.floor(Math.random() * ops.length)];
    } else if (difficulty === 'medium') {
      a = Math.floor(Math.random() * 30) + 5;
      b = Math.floor(Math.random() * 20) + 1;
      const ops = ['+', '-', '*'];
      operator = ops[Math.floor(Math.random() * ops.length)];
    } else {
      a = Math.floor(Math.random() * 20) + 1;
      b = Math.floor(Math.random() * 10) + 1;
      const ops = ['+', '-'];
      operator = ops[Math.floor(Math.random() * ops.length)];
    }
    
    switch (operator) {
      case '+': answer = a + b; break;
      case '-': answer = a - b; break;
      case '*': answer = a * b; break;
      default: answer = a + b;
    }

    await reply(`╭─────────────────╮
│ 🧮 QUICK MATH
╰─────────────────╯

Difficulty: ${difficulty.toUpperCase()}

${a} ${operator} ${b} = ?

(Answer: ${answer})`);
  }
};

export default command;
