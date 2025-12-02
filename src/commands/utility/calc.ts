import type { Command } from '../../types/index.js';

function safeEval(expression: string): number | null {
  const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, '');
  
  if (sanitized !== expression.replace(/\s/g, '').replace(/x/gi, '*').replace(/÷/g, '/')) {
    return null;
  }

  try {
    const result = Function(`"use strict"; return (${sanitized})`)();
    
    if (typeof result !== 'number' || !isFinite(result)) {
      return null;
    }
    
    return result;
  } catch {
    return null;
  }
}

export const command: Command = {
  name: 'calc',
  aliases: ['calculate', 'math', 'calculator'],
  description: 'Calculate a mathematical expression',
  category: 'utility',
  usage: 'calc <expression>',
  examples: ['calc 2+2', 'calc 100*5', 'calc (50+25)/3', 'calc 15%4'],
  cooldown: 3,

  async execute({ args, reply }) {
    if (!args.length) {
      await reply(`🧮 *Calculator*\n\nUsage: calc <expression>\n\nSupported operations:\n• + (addition)\n• - (subtraction)\n• * or x (multiplication)\n• / or ÷ (division)\n• % (modulo)\n• () (parentheses)\n\nExamples:\n• calc 2+2\n• calc 100*5\n• calc (50+25)/3`);
      return;
    }

    const expression = args.join(' ')
      .replace(/x/gi, '*')
      .replace(/÷/g, '/');

    const result = safeEval(expression);

    if (result === null) {
      await reply('❌ Invalid mathematical expression!');
      return;
    }

    const formatted = Number.isInteger(result) ? result.toString() : result.toFixed(6).replace(/\.?0+$/, '');

    await reply(`🧮 *Calculator*\n\n📝 Expression: ${args.join(' ')}\n✨ Result: ${formatted}`);
  },
};
